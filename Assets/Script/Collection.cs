using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class Collection : MonoBehaviour
{
    public bool isShowMonster=false;
    [SerializeField] Image image;
    [SerializeField] Sprite monster;
    [SerializeField] Sprite hatena;
    [SerializeField] int ID;
    [SerializeField] TextMeshProUGUI ID_Text;

    //[SerializeField] Image CollectionImage;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if (isShowMonster)
        {
            image.sprite = monster;
        }
        else
        {
            image.sprite = hatena;
        }

        ID_Text.text = ID.ToString("D3"); // 3桁にゼロパディングする場合
    }

    public void SelectMonster()
    {
        if(isShowMonster)
        {
            //CollectionImage.sprite = monster;
        }
       
    }
}
