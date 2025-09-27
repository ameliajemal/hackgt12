using UnityEngine;

public class PosLogger : MonoBehaviour
{
    // Runs at a fixed timestep (good for physics-related tracking)
    private void FixedUpdate()
    {
        Vector3 pos = transform.position;
        Debug.Log($"Controller Position - X:{pos.x:F3}, Y:{pos.y:F3}, Z:{pos.z:F3}");
        FindFirstObjectByType<VRLogger>().LogMessage("pos", $"Controller Position - X:{pos.x:F3}, Y:{pos.y:F3}, Z:{pos.z:F3}");
    }
}