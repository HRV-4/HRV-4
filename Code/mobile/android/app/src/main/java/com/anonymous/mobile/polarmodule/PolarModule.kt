package com.anonymous.mobile.polarmodule 

import java.text.SimpleDateFormat
import java.util.Locale
import java.util.Date
import android.util.Log 
import android.bluetooth.BluetoothAdapter 
import android.bluetooth.BluetoothManager 
import android.content.Context 
import android.content.Intent 
import android.app.Activity 
import com.facebook.react.bridge.ReactApplicationContext 
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod 
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import io.reactivex.rxjava3.disposables.Disposable 
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers 
import com.polar.sdk.api.PolarBleApi 
import com.polar.sdk.api.PolarBleApiCallback 
import com.polar.sdk.api.PolarBleApiDefaultImpl.defaultImplementation 
import com.polar.sdk.api.model.PolarDeviceInfo
import com.polar.sdk.api.model.PolarHrData
import com.polar.sdk.api.model.PolarPpiData

class PolarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) { 
    private lateinit var api: PolarBleApi 
    private var deviceId: String? = null 
    
    private var scanDisposable: Disposable? = null
    private var hrDisposable: Disposable? = null
    private var ppiDisposable: Disposable? = null

    private val timeFormat = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
    
    override fun getName(): String { 
        return "PolarModule" 
    } 
    
    @ReactMethod 
    fun sayHello(promise: Promise) { 
        Log.d("PolarModule", "Hello from the Kotlin hosted Polar module") 
        promise.resolve("Hello from the Kotlin hosted Polar module") 
    } 
    
    @ReactMethod 
    fun initializeSdk(promise: Promise) { 
        try { 
            if (::api.isInitialized) { 
                promise.resolve("SDK already initialized") 
                return 
            } 
            
            api = defaultImplementation( 
                reactApplicationContext, 
                setOf( 
                    PolarBleApi.PolarBleSdkFeature.FEATURE_POLAR_ONLINE_STREAMING, 
                    PolarBleApi.PolarBleSdkFeature.FEATURE_DEVICE_INFO, 
                    PolarBleApi.PolarBleSdkFeature.FEATURE_BATTERY_INFO 
                ) 
            ) 
            
            api.setApiCallback(object : PolarBleApiCallback() { 
                override fun blePowerStateChanged(powered: Boolean) { 
                    val params = Arguments.createMap()
                    params.putBoolean("powered", powered)
                    sendEvent("onBlePowerChanged", params)
                } 
                
                override fun deviceConnected(info: PolarDeviceInfo) {
                    deviceId = info.deviceId 
                    
                    val params = Arguments.createMap()
                    params.putString("deviceId", info.deviceId)
                    sendEvent("onDeviceConnected", params)
                } 
                
                override fun deviceDisconnected(info: PolarDeviceInfo) { 
                    val params = Arguments.createMap()
                    params.putString("deviceId", info.deviceId)
                    sendEvent("onDeviceDisconnected", params)
                }

                override fun bleSdkFeatureReady(identifier: String, feature: PolarBleApi.PolarBleSdkFeature) {
                    if (feature == PolarBleApi.PolarBleSdkFeature.FEATURE_POLAR_ONLINE_STREAMING) {
                        startPPiStreamingInternal()
                    }
                }
            }) 
                
            promise.resolve("SDK initialized") 
        } 
        catch (e: Exception) { 
            promise.reject("INIT_ERROR", e) 
        } 
    } 
    
    @ReactMethod 
    fun scanForDevice(promise: Promise) { 
        if (!::api.isInitialized) { 
            promise.reject("NOT_INITIALIZED", "Call initializeSdk first") 
            return 
        } 
        
        scanDisposable?.dispose() 
        scanDisposable = api.searchForDevice()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                { 
                    device -> 
                        val params = Arguments.createMap()
                        params.putString("deviceId", device.deviceId)
                        sendEvent("onDeviceFound", params)
                        scanDisposable?.dispose()
                }, 
                { 
                    error -> promise.reject("SCAN_ERROR", error) 
                } 
        ) 
        
        promise.resolve("Scanning") 
    } 
    
    @ReactMethod 
    fun checkBluetooth(promise: Promise) { 
        val activity = reactApplicationContext.currentActivity 
            ?: return promise.reject("NO_ACTIVITY", "Activity is null")
        val btManager = reactApplicationContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager 
        val bluetoothAdapter = btManager.adapter 
        
        if (bluetoothAdapter == null) { 
            promise.reject("NO_BT", "Device doesn't support Bluetooth") 
            return 
        } 
        
        if (!bluetoothAdapter.isEnabled) { 
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE) 
            activity.startActivityForResult(enableBtIntent, 1001) 
        } 
        
        promise.resolve("Bluetooth OK") 
    } 
    
    @ReactMethod 
    fun connectToDevice(deviceId: String, promise: Promise) { 
        try { 
            api.connectToDevice(deviceId) 
            promise.resolve("Connecting...") 
        } 
        catch (e: Exception) { 
            promise.reject("CONNECT_ERROR", e) 
        } 
    } 
    
    @ReactMethod 
    fun startHrStreaming(promise: Promise) { 
        val id = deviceId ?: return promise.reject("NO_DEVICE", "No device connected")

        hrDisposable?.dispose()

        hrDisposable = api.startHrStreaming(id) 
            .observeOn(AndroidSchedulers.mainThread()) 
            .subscribe( 
                { 
                    hrData: PolarHrData ->
                    for (sample in hrData.samples) {

                        val params = Arguments.createMap()
                        params.putInt("hr", sample.hr)

                        sendEvent("onHrData", params)
                    }
                }, 
                { 
                    error ->
                        val params = Arguments.createMap()
                        params.putString("message", error.message ?: "Unknown HR error")
                        sendEvent("onHrError", params)
                } 
            ) 
        promise.resolve("HR streaming started") 
    }

    private fun startPPiStreamingInternal() {
        val id = deviceId ?: return
        ppiDisposable?.dispose()

        ppiDisposable = api.startPpiStreaming(id)
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                { ppiData ->
                    val currentTime = timeFormat.format(Date())
                    val params = Arguments.createMap()
                    val ppiArray = Arguments.createArray()

                    for (sample in ppiData.samples) {
                        val sampleMap = Arguments.createMap()
                        sampleMap.putInt("ppi", sample.ppi)
                        sampleMap.putString("timestamp", currentTime)
                        ppiArray.pushMap(sampleMap)
                    }
                    
                    params.putArray("ppi", ppiArray)
                    sendEvent("onPpiData", params)
                },
                { error ->
                    val params = Arguments.createMap()
                    params.putString("message", error.message ?: "Unknown PPI error")
                    sendEvent("onPPiError", params)
                }
            )
    }
    
    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
    
    override fun invalidate() { 
        scanDisposable?.dispose() 
        hrDisposable?.dispose()
        ppiDisposable?.dispose()

        if (::api.isInitialized) { 
            api.shutDown() 
        } 
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN built-in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN built-in Event Emitter Calls.
    }
}