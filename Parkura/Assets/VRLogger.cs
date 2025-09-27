using UnityEngine;
using System.IO;

public class VRLogger : MonoBehaviour
{
    private string logFilePath;

    void Awake()
    {
        // Path to Downloads folder on Quest
        string downloadsPath = Path.Combine("/sdcard/Download", "quest_game_log.txt");
        logFilePath = downloadsPath;

        // Start session
        File.AppendAllText(logFilePath, $"\n--- Session started at {System.DateTime.Now} ---\n");
    }

    public void LogMessage(string message)
    {
        string logEntry = $"[{System.DateTime.Now:HH:mm:ss}] {message}\n";
        File.AppendAllText(logFilePath, logEntry);
    }

    void OnApplicationQuit()
    {
        File.AppendAllText(logFilePath, $"--- Session ended at {System.DateTime.Now} ---\n");
    }
}
