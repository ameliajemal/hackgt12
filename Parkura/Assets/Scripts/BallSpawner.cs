using NUnit.Framework;
using UnityEngine;
using System.Collections.Generic;

public class BallSpawner : MonoBehaviour
{
    [Header("Ball Settings")]
    public GameObject theBall;   // Assign your ball prefab here
    public float spawnRadius = 1f; // max distance from origin (scales the unit sphere)
    public float heightModifier = 0f;
    public float initialCount = 1f;

    List<GameObject> activeballs = new List<GameObject>();

    private void Start()
    {
        // Spawn the first ball when the game starts
        //for (int i = 0; i < initialCount; i++)
        //{
        //    SpawnBall();
        //}
        
        activeballs.Add(FindFirstObjectByType<BallDestroyOnPunch>().gameObject);
    }

    public void DestroyAllBalls()
    {
        foreach (GameObject ball in activeballs)
        {
            Destroy(ball);
        }
        activeballs.Clear();
    }



    public void SpawnBall()
    {
        if (PosLogger.TotalApples == 0)
        {
            FindFirstObjectByType<GameManager>().GameStart();
        }
        PosLogger.TotalApples += 1;
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
        newBall.GetComponent<BallDestroyOnPunch>().isStartingBall = false;
        // Attach self-destruct listener so when this ball dies, a new one spawns
        activeballs.Add(newBall);
    }
}
