using UnityEngine;
using System.IO;

public class VRLogger : MonoBehaviour
{
    private string basePath;

    void Awake()
    {
        // Base path to Downloads folder on Quest
        basePath = Application.persistentDataPath;

        // Start session log

        if (Directory.Exists(basePath))
        {
            try
            {
                string[] files = Directory.GetFiles(basePath);
                foreach (string file in files)
                {
                    File.Delete(file);
                }
                Debug.Log($"All files deleted in: {basePath}");
            }
            catch (System.Exception e)
            {
                Debug.LogError($"Failed to delete files: {e.Message}");
            }
        }
        else
        {
            Debug.LogWarning($"Directory does not exist: {basePath}");
        }

        OverwriteFile("general", $"--- Session started at {System.DateTime.Now} ---");
    }

    public void LogMessage(string tag, string message)
    {
        string logEntry = $"[{System.DateTime.Now:HH:mm:ss}] {message}";
        AppendToFile(tag, logEntry);
    }

    private void OverwriteFile(string tag, string content)
    {
        string filePath = Path.Combine(basePath, $"quest_game_log_{tag}.txt");
        try
        {
            File.WriteAllText(filePath, content + "\n"); // replaces file contents
        }
        catch (IOException e)
        {
            Debug.LogError($"Failed to write log to {filePath}: {e.Message}");
        }
    }

    private void AppendToFile(string tag, string content)
    {
        string filePath = Path.Combine(basePath, $"quest_game_log_{tag}.txt");
        try
        {
            File.AppendAllText(filePath, content + "\n");
        }
        catch (IOException e)
        {
            Debug.LogError($"Failed to write log to {filePath}: {e.Message}");
        }
    }

    void OnApplicationQuit()
    {
        AppendToFile("general", $"--- Session ended at {System.DateTime.Now} ---");
    }
}