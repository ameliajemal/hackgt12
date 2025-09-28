using TMPro;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public GameObject tipText;
    public GameObject gameOverText;
    public GameObject background1, background2;
    public TextMeshProUGUI gameOverTextMeshPro;
    public GameObject countdownTextObject;
    public TextMeshProUGUI countdownText; // Add a TMP text to show the countdown

    public GameObject leftHand = null;
    public GameObject rightHand = null;

    public int score = 0;

    public float gameDuration = 30f; // Duration of the game in seconds
    private float remainingTime;
    private bool isGameRunning = false;

    public bool startImmediately = false;

    void Start()
    {
        if (startImmediately)
        {
            GameStart();
        }
        gameOverTextMeshPro = gameOverText.GetComponent<TextMeshProUGUI>();
        countdownText = countdownTextObject.GetComponent<TextMeshProUGUI>();
        remainingTime = gameDuration;
        countdownText.text = remainingTime.ToString("F0");

    }

    public void GameStart()
    {
        tipText.SetActive(false);
        background1.SetActive(false);
        background2.SetActive(true);
        gameOverText.SetActive(false);

        remainingTime = gameDuration;
        isGameRunning = true;

        FindFirstObjectByType<BallSpawner>().SpawnBall();
        FindFirstObjectByType<BallSpawner>().SpawnBall();
        FindFirstObjectByType<BallSpawner>().SpawnBall();
    }

    private void Update()
    {
        if (isGameRunning)
        {
            remainingTime -= Time.deltaTime;

            // Update countdown display
            countdownText.text = Mathf.Ceil(remainingTime).ToString();

            // Check if time has run out
            if (remainingTime <= 0f)
            {
                remainingTime = 0f;
                isGameRunning = false;
                GameEnd();
            }
        }
    }

    public void GameEnd()
    {
        gameOverText.SetActive(true);
        countdownTextObject.SetActive(false);
        background1.SetActive(true);
        background2.SetActive(false);
        gameOverTextMeshPro.text = "Game Over!\n\nYour score is: " + score;

        PosLogger pl;
        bool foundControllers = true;
        if (!rightHand.TryGetComponent<PosLogger>(out pl))
        {
            foundControllers = false;
            gameOverTextMeshPro.text += "\n\nRight Hand - Logger not found.";
            return;
        }

        while (FindFirstObjectByType<BallDestroyOnPunch>() != null)
        {
            Destroy(FindFirstObjectByType<BallDestroyOnPunch>().gameObject);
        }

        rightHand.GetComponent<PosLogger>().PrintSummary();
        leftHand.GetComponent<PosLogger>().PrintSummary();
    }
}
