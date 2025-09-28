using System.Collections.Generic;
using UnityEngine;


public class PosLogger : MonoBehaviour
{
    private List<Vector3> positions = new List<Vector3>();
    private List<Vector3> rotations = new List<Vector3>();
    public List<float> velocities = new List<float>();
    public List<float> shakes = new List<float>();

    private Vector3 lastPos;
    private Quaternion lastRot;
    private bool firstFrame = true;

    static public int ApplesPicked = 0;
    static public int TotalApples = 1;

    public string loggerName = "defName";

    // Separate string logs
    private string velocityLog = "";
    private string shakeLog = "";
    private string positionLog = "";

    private int largeShakes = 0;

    private List<Quaternion> quaternions = new List<Quaternion>();

    public static bool startLogging = false;

    private void FixedUpdate()
    {
        if (!startLogging) return;

        Vector3 pos = transform.position;
        Quaternion rotQ = transform.rotation; // Use Quaternion instead of eulerAngles

        positions.Add(pos);
        quaternions.Add(rotQ);

        if (!firstFrame)
        {
            float velocity = (pos - lastPos).magnitude / Time.fixedDeltaTime;
            velocities.Add(velocity);

            // Signed angular velocity per axis (degrees/sec)
            Vector3 deltaEuler = new Vector3(
                Mathf.DeltaAngle(lastRot.eulerAngles.x, rotQ.eulerAngles.x),
                Mathf.DeltaAngle(lastRot.eulerAngles.y, rotQ.eulerAngles.y),
                Mathf.DeltaAngle(lastRot.eulerAngles.z, rotQ.eulerAngles.z)
            ) / Time.fixedDeltaTime;

            rotations.Add(deltaEuler);

            if (deltaEuler.magnitude > 4)
            {
                largeShakes++;
            }

            // Store magnitude for logging if you want
            float shakeMag = deltaEuler.magnitude;

            velocityLog += velocity.ToString("F4") + ",";
            shakeLog += shakeMag.ToString("F4") + ",";
        }
        else
        {
            firstFrame = false;
        }

        lastPos = pos;
        lastRot = rotQ;


        // Append positions every frame
        positionLog += $"({pos.x:F3},{pos.y:F3},{pos.z:F3});";

        lastPos = pos;
    }

    float EstimateTremorFrequency(List<Vector3> angularVelocities, float deltaTime)
    {
        List<float> axisVel = new List<float>();
        foreach (var v in angularVelocities)
            axisVel.Add(v.x); // choose x, y, or z depending on the tremor axis

        int crossings = 0;
        for (int i = 1; i < axisVel.Count; i++)
        {
            if ((axisVel[i - 1] > 11f && axisVel[i] <= -11f) || (axisVel[i - 1] < -11f && axisVel[i] >= 11f))
                crossings++;
        }

        float totalTime = axisVel.Count / 2f * deltaTime;
        float frequency = (crossings / 2f) / totalTime;
        return frequency;
    }


    public void PrintSummary()
    {

        float avgVelocity = velocities.Count > 0 ? Average(velocities) : 0f;
        float avgShake = shakes.Count > 0 ? Average(shakes) : 0f;

        var logger = FindFirstObjectByType<VRLogger>();

        logger.LogMessage(loggerName, $"AvgVelocity: {avgVelocity:F2}");
        logger.LogMessage(loggerName, $"Shaky: {avgShake:F2}");
        logger.LogMessage(loggerName, $"Points: {positions.Count}");

        float frequency = rotations.Count > 2 ? EstimateTremorFrequency(rotations, Time.fixedDeltaTime) : 0f;

        frequency = Mathf.Clamp(frequency, 0.0283f, 10f);


        logger.LogMessage(loggerName, $"Frequency: {frequency}");
        logger.LogMessage(loggerName, $"ApplesPicked: {ApplesPicked}");
        logger.LogMessage(loggerName, $"TotalApples: {TotalApples}");

        // Dump strings
        logger.LogMessage(loggerName, $"VelocityData: [{velocityLog}]");
        logger.LogMessage(loggerName, $"ShakeData: [{shakeLog}]");
        logger.LogMessage(loggerName, $"Positions: [{positionLog}]");
    }

    private float Average(List<float> data)
    {
        if (data.Count == 0) return 0f;
        float sum = 0f;
        foreach (float f in data) sum += f;
        return sum / data.Count;
    }
}
