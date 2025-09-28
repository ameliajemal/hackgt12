using UnityEngine;

public class BallDestroyOnPunch : MonoBehaviour
{
    public float punchThreshold = 2f; // tweak this until it feels right
    public bool isStartingBall = false;

    private void OnCollisionEnter(Collision collision)
    {
        // Check if the thing that hit the ball has a Rigidbody
        Rigidbody rb = collision.rigidbody;

        FindFirstObjectByType<BallSpawner>().SpawnBall();
        FindFirstObjectByType<GameManager>().score += 1;
        PosLogger.ApplesPicked += 1;
        if (rb != null)
        {
            // Measure the impact speed (relative velocity)
            
            float impactForce = collision.relativeVelocity.magnitude;
            Debug.Log("Impact force is: " + impactForce);
            FindFirstObjectByType<VRLogger>().LogMessage("force", "Impact force is: " + impactForce);
            // If the impact was strong enough, destroy the ball
            if (impactForce >= punchThreshold)
            {
                Destroy(gameObject);
            }
        }
        
        //FindFirstObjectByType<VRLogger>().LogMessage("force", "Impact force was too low to destroy the ball.");
        if (isStartingBall)
        {
            FindFirstObjectByType<GameManager>().GameStart();
        }
        Destroy(gameObject);

        
    }
}
