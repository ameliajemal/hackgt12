using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class LoginController : MonoBehaviour
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    public GameObject ame, ade, ale, nameInput, enter, tip;
    public TextMeshProUGUI nameInputText;
    public Button enterButton;

    void Start()
    {
        nameInputText = nameInput.GetComponent<TextMeshProUGUI>();
        enterButton = enter.GetComponent<Button>();
        enterButton.onClick.AddListener(() =>
        {
            string playerName = nameInputText.text;
            if (playerName.Length > 0)
            {
                ame.SetActive(false);
                ade.SetActive(false);
                ale.SetActive(false);
                nameInput.SetActive(false);
                enter.SetActive(false);
            }

            if (nameInputText.text == "Amelia")
            {
                ame.SetActive(true);
            }
            else if (nameInputText.text == "Aiden")
            {
                ade.SetActive(true);
            }
            else if (nameInputText.text == "Alex")
            {
                ale.SetActive(true);
            }

            tip.SetActive(true);
            BoxWithCollider.isActive = true;
        });
    }

    // Update is called once per frame
    void Update()
    {

    }
}
