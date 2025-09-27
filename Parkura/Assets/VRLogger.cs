using UnityEngine;
using System.IO;

public class VRLogger : MonoBehaviour
{
    private string basePath;

    void Awake()
    {
        // Base path to Downloads folder on Quest
        basePath = "/sdcard/Download";

        // Start session log
        AppendToFile("general", $"--- Session started at {System.DateTime.Now} ---");
    }

    public void LogMessage(string tag, string message)
    {
        string logEntry = $"[{System.DateTime.Now:HH:mm:ss}] {message}";
        AppendToFile(tag, logEntry);
    }

    private void AppendToFile(string tag, string content)
    {
        string filePath = Path.Combine(basePath, $"quest_game_log_{tag}.txt");
        File.AppendAllText(filePath, content + "\n");
    }

    void OnApplicationQuit()
    {
        AppendToFile("general", $"--- Session ended at {System.DateTime.Now} ---");
    }
}