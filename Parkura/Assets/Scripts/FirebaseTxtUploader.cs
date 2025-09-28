using Firebase;
using Firebase.Extensions;
using Firebase.Storage;
using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEngine;
using UnityEngine.Android;

public class FirebaseTxtUploader : MonoBehaviour
{
    FirebaseStorage storage;
    StorageReference storageRef;

    public GameObject logTextObject, logTextObject2;
    private TextMeshProUGUI logText, logText2;


    //#if UNITY_ANDROID && !UNITY_EDITOR
    //    string downloadFolder = "/sdcard/Download";
    //#else
    //    //string downloadFolder = Path.Combine(Application.dataPath, "TestFiles"); // Windows test folder
    //#endif
    string downloadFolder;

    void Awake()
    {
        downloadFolder = Application.persistentDataPath;// Set download folder path based on platform
    }


    public string patientName = "Adele_Shen";
    public string currentGame = "Pick_Apples";

    public float checkInterval = 5f; // seconds
    public float timer = 0f;

    private HashSet<string> uploadedFiles = new HashSet<string>();
    string dateTimeFolder;
    void Start()
    {
        logText = logTextObject.GetComponent<TextMeshProUGUI>();
        logText2 = logTextObject2.GetComponent<TextMeshProUGUI>();
        // Request runtime permission for external storage
        if (!Permission.HasUserAuthorizedPermission(Permission.ExternalStorageRead))
        {
            Permission.RequestUserPermission(Permission.ExternalStorageRead);
        }

        dateTimeFolder = DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss");
        // Initialize Firebase
        FirebaseApp.CheckAndFixDependenciesAsync().ContinueWithOnMainThread(task =>
        {
            FirebaseApp app = FirebaseApp.DefaultInstance;
            Debug.Log("Firebase initialized on Quest!");
            logText.text = "Firebase initialized on Quest!";
            storage = FirebaseStorage.DefaultInstance;
            storageRef = storage.RootReference;
        });
    }

    void Update()
    {
        timer += Time.deltaTime;
        if (timer >= checkInterval)
        {
            timer = 0f;
            Debug.Log("Uploading files.");
            //logText.text = "Uploading files." + Time.time;
            UploadTxtFilesFromDownload();
        }
    }

    void OnApplicationQuit()
    {
        Debug.Log("App quitting — uploading remaining txt files.");
        UploadTxtFilesFromDownload();
    }

    void UploadTxtFilesFromDownload()
    {
        if (!Directory.Exists(downloadFolder))
        {
            Debug.LogError("Download folder not found: " + downloadFolder);
            logText.text = "Download folder not found: " + downloadFolder;
            return;
        }

        string[] files = Directory.GetFiles(downloadFolder, "*.txt");
        logText2.text = "Found " + files.Length + " .txt files.";

        foreach (string filePath in files)
        {
            // Keep original file name
            string fileName = Path.GetFileName(filePath);
            logText.text = "Uploading: " + fileName;

            // Full cloud path
            string cloudFilePath = $"{patientName}/{currentGame}/{dateTimeFolder}/{fileName}";

            // Upload (will overwrite if file already exists)
            UploadFile(filePath, cloudFilePath);

            // Optional: track uploaded file
            //uploadedFiles.Add(filePath);
        }
    }



    void UploadFile(string localFilePath, string cloudPath)
    {
        if (storageRef == null) return;
        string fileUri = "file://" + localFilePath;
        StorageReference fileRef = storageRef.Child(cloudPath);
        Debug.Log("Uploading: " + fileUri);
        logText.text = "Uploading: " + fileUri;
        fileRef.PutFileAsync(fileUri).ContinueWithOnMainThread(task =>
        {
            if (!task.IsFaulted && !task.IsCanceled)
            {
                Debug.Log("Upload finished: " + cloudPath);

                // Optional: get download URL
                fileRef.GetDownloadUrlAsync().ContinueWithOnMainThread(urlTask =>
                {
                    if (!urlTask.IsFaulted && !urlTask.IsCanceled)
                    {
                        Debug.Log("File available at: " + urlTask.Result);
                    }
                });
            }
            else
            {
                Debug.LogError("Upload failed for " + fileUri + ": " + task.Exception);
                logText.text = "Upload failed for " + fileUri + ": " + task.Exception;
            }
        });
    }
}
