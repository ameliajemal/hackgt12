using UnityEngine;

public class BallDestroyOnPunch : MonoBehaviour
{
    public float punchThreshold = 2f; // tweak this until it feels right

    private void OnCollisionEnter(Collision collision)
    {
        // Check if the thing that hit the ball has a Rigidbody
        Rigidbody rb = collision.rigidbody;
        
        
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
        //Destroy(gameObject);
    }
}
