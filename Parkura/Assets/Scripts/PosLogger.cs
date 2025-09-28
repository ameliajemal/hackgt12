using System.Collections.Generic;
using UnityEngine;

public class PosLogger : MonoBehaviour
{
    private List<Vector3> positions = new List<Vector3>();
    private List<Vector3> rotations = new List<Vector3>();
    public List<float> velocities = new List<float>();
    public List<float> shakes = new List<float>();

    private Vector3 lastPos;
    private bool firstFrame = true;

    static public int ApplesPicked = 0;
    static public int TotalApples = 0;

    public string loggerName = "defName";

    private void FixedUpdate()
    {
        Vector3 pos = transform.position;
        Vector3 rot = transform.eulerAngles;

        positions.Add(pos);
        rotations.Add(rot);

        // Calculate velocity magnitude
        if (!firstFrame)
        {
            float velocity = (pos - lastPos).magnitude / Time.fixedDeltaTime;
            velocities.Add(velocity);

            // Calculate shakiness (change in rotation magnitude)
            Vector3 deltaRot = rot - rotations[rotations.Count - 2];
            float shake = deltaRot.magnitude;
            shakes.Add(shake);
        }
        else
        {
            firstFrame = false;
        }

        lastPos = pos;
    }

    public void PrintSummary()
    {
        float avgVelocity = velocities.Count > 0 ? Average(velocities) : 0f;
        float avgShake = shakes.Count > 0 ? Average(shakes) : 0f;

        var logger = FindFirstObjectByType<VRLogger>();

        logger.LogMessage(loggerName, $"AvgVelocity: {avgVelocity:F2}");
        logger.LogMessage(loggerName, $"Shaky: {avgShake:F2}");
        logger.LogMessage(loggerName, $"Points: {positions.Count}");
        logger.LogMessage(loggerName, $"VelocityData: [{string.Join(",", velocities)}]");
        logger.LogMessage(loggerName, $"ShakeData: [{string.Join(",", shakes)}]");
        logger.LogMessage(loggerName, $"Positions: [{string.Join(";", positions)}]");
        logger.LogMessage(loggerName, $"ApplesPicked: {ApplesPicked}");
        logger.LogMessage(loggerName, $"TotalApples: {TotalApples}");
    }

    private float Average(List<float> data)
    {
        if (data.Count == 0) return 0f;
        float sum = 0f;
        foreach (float f in data) sum += f;
        return sum / data.Count;
    }
}
