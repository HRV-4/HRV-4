package com.polar.polarsdkecghrdemo

import android.content.ContentValues
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.androidplot.xy.BoundaryMode
import com.androidplot.xy.StepMode
import com.androidplot.xy.XYGraphWidget
import com.androidplot.xy.XYPlot
import com.polar.sdk.api.PolarBleApi
import com.polar.sdk.api.PolarBleApiCallback
import com.polar.sdk.api.PolarBleApiDefaultImpl.defaultImplementation
import com.polar.sdk.api.errors.PolarInvalidArgument
import com.polar.sdk.api.model.PolarDeviceInfo
import com.polar.sdk.api.model.PolarHrData
import com.polar.sdk.api.model.PolarPpiData
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers
import io.reactivex.rxjava3.disposables.Disposable
import org.json.JSONArray
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.text.DecimalFormat
import java.text.SimpleDateFormat
import java.util.*

class HRActivity : AppCompatActivity(), PlotterListener {
    companion object {
        private const val TAG = "HRActivity"
    }

    private lateinit var api: PolarBleApi
    private lateinit var plotter: HrAndRrPlotter
    private lateinit var textViewHR: TextView
    private lateinit var textViewRR: TextView
    private lateinit var textViewDeviceId: TextView
    private lateinit var textViewBattery: TextView
    private lateinit var textViewFwVersion: TextView
    private lateinit var plot: XYPlot
    private var hrDisposable: Disposable? = null
    private var ppiDisposable: Disposable? = null

    private lateinit var deviceId: String
    private val recordedIntervals = mutableListOf<Pair<String, Int>>()
    private val timeFormat = SimpleDateFormat("HH:mm:ss.SSS", Locale.getDefault())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_hr)
        deviceId = intent.getStringExtra("id") ?: throw Exception("HRActivity couldn't be created, no deviceId given")
        textViewHR = findViewById(R.id.hr_view_hr)
        textViewRR = findViewById(R.id.hr_view_rr)
        textViewDeviceId = findViewById(R.id.hr_view_deviceId)
        textViewBattery = findViewById(R.id.hr_view_battery_level)
        textViewFwVersion = findViewById(R.id.hr_view_fw_version)
        plot = findViewById(R.id.hr_view_plot)

        api = defaultImplementation(
            applicationContext,
            setOf(
                PolarBleApi.PolarBleSdkFeature.FEATURE_POLAR_ONLINE_STREAMING,
                PolarBleApi.PolarBleSdkFeature.FEATURE_BATTERY_INFO,
                PolarBleApi.PolarBleSdkFeature.FEATURE_DEVICE_INFO
            )
        )
        api.setApiLogger { str: String -> Log.d("SDK", str) }
        api.setApiCallback(object : PolarBleApiCallback() {
            override fun blePowerStateChanged(powered: Boolean) {
                Log.d(TAG, "BluetoothStateChanged $powered")
            }

            override fun deviceConnected(polarDeviceInfo: PolarDeviceInfo) {
                Log.d(TAG, "Device connected ${polarDeviceInfo.deviceId}")
                Toast.makeText(applicationContext, R.string.connected, Toast.LENGTH_SHORT).show()
            }

            override fun deviceDisconnected(polarDeviceInfo: PolarDeviceInfo) {
                Log.d(TAG, "Device disconnected ${polarDeviceInfo.deviceId}")
            }

            override fun bleSdkFeatureReady(identifier: String, feature: PolarBleApi.PolarBleSdkFeature) {
                if (feature == PolarBleApi.PolarBleSdkFeature.FEATURE_POLAR_ONLINE_STREAMING) {
                    streamHR()
                    streamPPI()
                }
            }
        })

        try {
            api.connectToDevice(deviceId)
        } catch (a: PolarInvalidArgument) {
            a.printStackTrace()
        }

        textViewDeviceId.text = "ID: $deviceId"
        plotter = HrAndRrPlotter()
        plotter.setListener(this)
        plot.addSeries(plotter.hrSeries, plotter.hrFormatter)
        plot.addSeries(plotter.rrSeries, plotter.rrFormatter)
        plot.setRangeBoundaries(50, 100, BoundaryMode.AUTO)
        plot.setDomainBoundaries(0, 360000, BoundaryMode.AUTO)
        plot.setRangeStep(StepMode.INCREMENT_BY_VAL, 10.0)
        plot.setDomainStep(StepMode.INCREMENT_BY_VAL, 60000.0)
        plot.graph.getLineLabelStyle(XYGraphWidget.Edge.LEFT).format = DecimalFormat("#")
    }

    override fun onDestroy() {
        super.onDestroy()
        saveDataToJson()
        hrDisposable?.dispose()
        ppiDisposable?.dispose()
        api.shutDown()
    }

    private fun saveDataToJson() {
        if (recordedIntervals.isEmpty()) return

        try {
            val jsonObject = JSONObject()
            jsonObject.put("deviceId", deviceId)
            jsonObject.put("session_start", SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date()))
            
            val jsonArray = JSONArray()
            recordedIntervals.forEach { (timestamp, value) ->
                val entry = JSONObject()
                entry.put("time", timestamp)
                entry.put("interval_ms", value)
                jsonArray.put(entry)
            }
            jsonObject.put("data", jsonArray)

            val fileName = "Polar_Data_${System.currentTimeMillis()}.json"
            
            val resolver = contentResolver
            val contentValues = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                put(MediaStore.MediaColumns.MIME_TYPE, "application/json")
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                }
            }

            val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
            uri?.let {
                resolver.openOutputStream(it)?.use { outputStream ->
                    OutputStreamWriter(outputStream).use { writer ->
                        writer.write(jsonObject.toString(4))
                    }
                }
                Log.d(TAG, "JSON saved to Downloads: $fileName")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to save JSON to Downloads: ${e.message}")
        }
    }

    override fun update() {
        runOnUiThread { plot.redraw() }
    }

    fun streamHR() {
        if (hrDisposable?.isDisposed != false) {
            hrDisposable = api.startHrStreaming(deviceId)
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    { hrData: PolarHrData ->
                        val currentTime = timeFormat.format(Date())
                        for (sample in hrData.samples) {
                            textViewHR.text = sample.hr.toString()
                            plotter.addValues(sample)
                            sample.rrsMs.forEach { recordedIntervals.add(currentTime to it) }
                        }
                    },
                    { error -> Log.e(TAG, "HR stream failed: $error") }
                )
        }
    }

    fun streamPPI() {
        if (ppiDisposable?.isDisposed != false) {
            ppiDisposable = api.startPpiStreaming(deviceId)
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    { ppiData: PolarPpiData ->
                        val currentTime = timeFormat.format(Date())
                        for (sample in ppiData.samples) {
                            textViewRR.text = "${sample.ppi} ms"
                            recordedIntervals.add(currentTime to sample.ppi)
                        }
                    },
                    { error -> Log.e(TAG, "PPI stream failed: $error") }
                )
        }
    }
}