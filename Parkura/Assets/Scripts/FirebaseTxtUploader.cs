using Firebase;
using Firebase.Extensions;
using Firebase.Storage;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.Android;

public class FirebaseTxtUploader : MonoBehaviour
{
    FirebaseStorage storage;
    StorageReference storageRef;

#if UNITY_ANDROID && !UNITY_EDITOR
    string downloadFolder = "/storage/emulated/0/Download/";
#else
    string downloadFolder = Path.Combine(Application.dataPath, "TestFiles"); // Windows test folder
#endif

    public string patientName = "Adele_Shen";
    public string currentGame = "Pick_Apples";
    
    public float checkInterval = 5f; // seconds
    public  float timer = 0f;

    private HashSet<string> uploadedFiles = new HashSet<string>();

    void Start()
    {
        // Request runtime permission for external storage
        if (!Permission.HasUserAuthorizedPermission(Permission.ExternalStorageRead))
        {
            Permission.RequestUserPermission(Permission.ExternalStorageRead);
        }

        // Initialize Firebase
        FirebaseApp.CheckAndFixDependenciesAsync().ContinueWithOnMainThread(task => {
            FirebaseApp app = FirebaseApp.DefaultInstance;
            Debug.Log("Firebase initialized on Quest!");

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
            return;
        }

        string[] files = Directory.GetFiles(downloadFolder, "*.txt");

        foreach (string filePath in files)
        {
            // Keep original file name
            string fileName = Path.GetFileName(filePath);

            // Current date folder
            string dateFolder = System.DateTime.Now.ToString("yyyy-MM-dd");

            // Full cloud path
            string cloudFilePath = $"{patientName}/{currentGame}/{dateFolder}/{fileName}";

            // Upload (will overwrite if file already exists)
            UploadFile(filePath, cloudFilePath);

            // Optional: track uploaded file
            uploadedFiles.Add(filePath);
        }
    }



    void UploadFile(string localFilePath, string cloudPath)
    {
        if (storageRef == null) return;

        StorageReference fileRef = storageRef.Child(cloudPath);
        Debug.Log("Uploading: " + localFilePath);

        fileRef.PutFileAsync(localFilePath).ContinueWithOnMainThread(task => {
            if (!task.IsFaulted && !task.IsCanceled)
            {
                Debug.Log("Upload finished: " + cloudPath);

                // Optional: get download URL
                fileRef.GetDownloadUrlAsync().ContinueWithOnMainThread(urlTask => {
                    if (!urlTask.IsFaulted && !urlTask.IsCanceled)
                    {
                        Debug.Log("File available at: " + urlTask.Result);
                    }
                });
            }
            else
            {
                Debug.LogError("Upload failed for " + localFilePath + ": " + task.Exception);
            }
        });
    }
}
