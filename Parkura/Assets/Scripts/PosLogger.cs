using UnityEngine;

public class PosLogger : MonoBehaviour
{
    // Runs at a fixed timestep (good for physics-related tracking)
    private void FixedUpdate()
    {
        Vector3 pos = transform.position;
        Vector3 rot = transform.eulerAngles; // rotation in degrees

        string logMessage = $"Controller Position - X:{pos.x:F3}, Y:{pos.y:F3}, Z:{pos.z:F3} | " +
                            $"Rotation - X:{rot.x:F3}, Y:{rot.y:F3}, Z:{rot.z:F3}";

        Debug.Log(logMessage);

        // Assuming VRLogger has a LogMessage method
        FindFirstObjectByType<VRLogger>().LogMessage("pos_rot", logMessage);
    }
}
