using UnityEngine;

public class BallSpawner : MonoBehaviour
{
    [Header("Ball Settings")]
    public GameObject theBall;   // Assign your ball prefab here
    public float spawnRadius = 1f; // max distance from origin (scales the unit sphere)
    public float heightModifier = 0f;
    public float initialCount = 1f;

    private void Start()
    {
        // Spawn the first ball when the game starts
        for (int i = 0; i < initialCount; i++)
        {
            SpawnBall();
        }
        
    }

    public void SpawnBall()
    {
        if (theBall == null)
        {
            Debug.LogWarning("No ball prefab assigned to BallSpawner!");
            return;
        }

        // Generate a random point inside the unit sphere
        Vector3 randomPos = Random.insideUnitSphere;

        // Clamp it to the first quadrant (x,y,z >= 0)
        randomPos = new Vector3(
            Mathf.Abs(randomPos.x),
            Mathf.Abs(randomPos.y) + heightModifier,
            Mathf.Abs(randomPos.z)
        );

        // Scale by adjustable radius
        randomPos *= spawnRadius;

        // Instantiate new ball
        GameObject newBall = Instantiate(theBall, randomPos, Quaternion.identity);

        // Attach self-destruct listener so when this ball dies, a new one spawns
        BallDestroyNotifier notifier = newBall.AddComponent<BallDestroyNotifier>();
        notifier.spawner = this;
    }
}

public class BallDestroyNotifier : MonoBehaviour
{
    [HideInInspector] public BallSpawner spawner;

    private void OnDestroy()
    {
        if (spawner != null && Application.isPlaying)
        {
            // Delay by one frame so Destroy() completes
            spawner.Invoke(nameof(spawner.SpawnBall), 0.05f);
        }
    }
}
