using UnityEngine;

public class BallDestroyOnPunch : MonoBehaviour
{
    public float punchThreshold = 2f; // tweak this until it feels right
    public bool isStartingBall = false;

    public int framesLeft = 0;

    public Vector3 initialPosition = Vector3.zero;
    public float multiplier = 1.0f;

    private void FixedUpdate()
    {
        framesLeft -= 1;
        framesLeft = Mathf.Clamp(framesLeft, 0, 100);
    }

    private void OnCollisionEnter(Collision collision)
    {
        if(framesLeft != 0)
        {
            return;
        }
        framesLeft = 30;
        // Check if the thing that hit the ball has a Rigidbody
        Rigidbody rb = collision.rigidbody;
        FindFirstObjectByType<GameManager>().score += 1;
        FindFirstObjectByType<GameManager>().GameStart();
        PosLogger.ApplesPicked += 1;
        PosLogger.TotalApples += 1;
        if (rb != null)
        {
            // Measure the impact speed (relative velocity)

            float impactForce = collision.relativeVelocity.magnitude;
            Debug.Log("Impact force is: " + impactForce);
            FindFirstObjectByType<VRLogger>().LogMessage("force", "Impact force is: " + impactForce);
            // If the impact was strong enough, destroy the ball
            if (impactForce >= punchThreshold)
            {
            }
        }

        Vector3 offset = Random.insideUnitSphere;
        offset.y = Mathf.Abs(offset.y) + initialPosition.y; // ensure it goes up
        offset.z = Mathf.Abs(offset.z) + initialPosition.z; // ensure it goes forward
        offset.x = Mathf.Abs(offset.x) + initialPosition.x; // ensure it goes right
        
        
        offset *= multiplier;
        
        transform.position = offset;
    }
}
