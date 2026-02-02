package com.polar.polarsdkecghrdemo

import android.Manifest
import android.app.Activity
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.text.InputType
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.polar.sdk.api.PolarBleApi
import com.polar.sdk.api.PolarBleApiCallback
import com.polar.sdk.api.PolarBleApiDefaultImpl.defaultImplementation
import com.polar.sdk.api.model.PolarDeviceInfo
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers
import io.reactivex.rxjava3.disposables.Disposable

class MainActivity : AppCompatActivity() {
    companion object {
        private const val TAG = "Polar_MainActivity"
        private const val SHARED_PREFS_KEY = "polar_device_id"
        private const val PERMISSION_REQUEST_CODE = 1
    }

    private lateinit var sharedPreferences: SharedPreferences
    private val bluetoothOnActivityResultLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result: ActivityResult ->
        if (result.resultCode != Activity.RESULT_OK) {
            Log.w(TAG, "Bluetooth off")
        }
    }
    private var deviceId: String? = null
    private lateinit var api: PolarBleApi
    private var scanDisposable: Disposable? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        sharedPreferences = getPreferences(MODE_PRIVATE)
        deviceId = sharedPreferences.getString(SHARED_PREFS_KEY, "")

        api = defaultImplementation(applicationContext, setOf(
            PolarBleApi.PolarBleSdkFeature.FEATURE_POLAR_ONLINE_STREAMING,
            PolarBleApi.PolarBleSdkFeature.FEATURE_DEVICE_INFO,
            PolarBleApi.PolarBleSdkFeature.FEATURE_BATTERY_INFO
        ))

        api.setApiCallback(object : PolarBleApiCallback() {
            override fun blePowerStateChanged(powered: Boolean) {
                Log.d(TAG, "BluetoothStateChanged $powered")
            }

            override fun deviceConnected(polarDeviceInfo: PolarDeviceInfo) {
                Log.d(TAG, "Device connected ${polarDeviceInfo.deviceId}")
                deviceId = polarDeviceInfo.deviceId
                saveDeviceId(deviceId!!)
                runOnUiThread {
                    showToast("Connected to ${polarDeviceInfo.name}")
                }
            }

            override fun deviceDisconnected(polarDeviceInfo: PolarDeviceInfo) {
                Log.d(TAG, "Device disconnected ${polarDeviceInfo.deviceId}")
            }
        })

        val setIdButton: Button = findViewById(R.id.buttonSetID)
        val autoConnectButton: Button = findViewById(R.id.buttonAutoConnect)
        val ecgConnectButton: Button = findViewById(R.id.buttonConnectEcg)
        val hrConnectButton: Button = findViewById(R.id.buttonConnectHr)
        
        checkBT()

        setIdButton.setOnClickListener { onClickChangeID(it) }
        autoConnectButton.setOnClickListener { onClickAutoConnect(it) }
        ecgConnectButton.setOnClickListener { onClickConnectEcg(it) }
        hrConnectButton.setOnClickListener { onClickConnectHr(it) }
    }

    private fun onClickAutoConnect(view: View) {
        checkBT()
        
        if (!isLocationEnabled()) {
            showToast("Please turn ON Location (GPS) in your phone settings!")
            return
        }

        showToast("Scanning for Verity Sense...")
        Log.d(TAG, "Starting scan...")
        
        scanDisposable?.dispose()
        scanDisposable = api.searchForDevice()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                { polarDeviceInfo: PolarDeviceInfo ->
                    Log.d(TAG, "Found device: ${polarDeviceInfo.name} [${polarDeviceInfo.deviceId}]")
                    deviceId = polarDeviceInfo.deviceId
                    saveDeviceId(deviceId!!)
                    showToast("Found: ${polarDeviceInfo.name}. Now click Connect HR.")
                    scanDisposable?.dispose()
                },
                { error ->
                    Log.e(TAG, "Scan error: $error")
                    showToast("Scan failed: ${error.message}")
                }
            )
    }

    private fun isLocationEnabled(): Boolean {
        val locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) || 
               locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
    }

    private fun saveDeviceId(id: String) {
        val editor = sharedPreferences.edit()
        editor.putString(SHARED_PREFS_KEY, id)
        editor.apply()
    }

    private fun onClickConnectEcg(view: View) {
        if (deviceId.isNullOrBlank()) deviceId = sharedPreferences.getString(SHARED_PREFS_KEY, "")
        if (deviceId.isNullOrBlank()) {
            showDialog(view)
        } else {
            val intent = Intent(this, ECGActivity::class.java)
            intent.putExtra("id", deviceId)
            startActivity(intent)
        }
    }

    private fun onClickConnectHr(view: View) {
        if (deviceId.isNullOrBlank()) deviceId = sharedPreferences.getString(SHARED_PREFS_KEY, "")
        if (deviceId.isNullOrBlank()) {
            showDialog(view)
        } else {
            val intent = Intent(this, HRActivity::class.java)
            intent.putExtra("id", deviceId)
            startActivity(intent)
        }
    }

    private fun onClickChangeID(view: View) {
        showDialog(view)
    }

    private fun showDialog(view: View) {
        val dialog = AlertDialog.Builder(this, R.style.PolarTheme)
        dialog.setTitle("Enter your Polar device's ID")
        val viewInflated = LayoutInflater.from(applicationContext).inflate(R.layout.device_id_dialog_layout, view.rootView as ViewGroup, false)
        val input = viewInflated.findViewById<EditText>(R.id.input)
        if (deviceId?.isNotEmpty() == true) input.setText(deviceId)
        input.inputType = InputType.TYPE_CLASS_TEXT
        dialog.setView(viewInflated)
        dialog.setPositiveButton("OK") { _: DialogInterface?, _: Int ->
            deviceId = input.text.toString().trim().uppercase()
            saveDeviceId(deviceId!!)
        }
        dialog.setNegativeButton("Cancel") { dialogInterface: DialogInterface, _: Int -> dialogInterface.cancel() }
        dialog.show()
    }

    private fun checkBT() {
        val btManager = applicationContext.getSystemService(BLUETOOTH_SERVICE) as BluetoothManager
        val bluetoothAdapter: BluetoothAdapter? = btManager.adapter
        if (bluetoothAdapter == null) {
            showToast("Device doesn't support Bluetooth")
            return
        }

        if (!bluetoothAdapter.isEnabled) {
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            bluetoothOnActivityResultLauncher.launch(enableBtIntent)
        }

        val permissions = mutableListOf<String>()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            permissions.add(Manifest.permission.BLUETOOTH_SCAN)
            permissions.add(Manifest.permission.BLUETOOTH_CONNECT)
        } else {
            permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)
            permissions.add(Manifest.permission.ACCESS_COARSE_LOCATION)
        }
        
        requestPermissions(permissions.toTypedArray(), PERMISSION_REQUEST_CODE)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSION_REQUEST_CODE) {
            for (result in grantResults) {
                if (result == PackageManager.PERMISSION_DENIED) {
                    showToast("Permissions missing")
                    return
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        scanDisposable?.dispose()
        api.shutDown()
    }

    private fun showToast(message: String) {
        Toast.makeText(applicationContext, message, Toast.LENGTH_SHORT).show()
    }
}