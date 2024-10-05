using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Random = UnityEngine.Random;

public class GameScript : MonoBehaviour
{
    private AudioSource audio;
    [SerializeField] List<AudioClip> SEs;
    public MonsterDisplay monsterDisplay;
    private CameraScript CameraScript;
    //���C��
    public GameObject Main;
    [SerializeField] GameObject NoWallet;
    public int UnkoPoint = 0;
    public int ExpPoint = 20340;
    private const int MaxExpPoint = 48000;
    [SerializeField] TextMeshProUGUI Text_Point;
    [SerializeField] TextMeshProUGUI Text_HP;
    [SerializeField] TextMeshProUGUI Text_CP;
    [SerializeField] TextMeshProUGUI Text_EXP;
    public List<MonstersClass> HaveMonsters;
    public List<MonstersClass> AllMonsters;
    public MonstersClass CurrentMonster;
  
    //���j���[
    [SerializeField] GameObject Menu;

    //�R���N�V����
    [SerializeField] GameObject Collection;
    [SerializeField] List<Sprite> MonsterCards;
    [SerializeField] Image MonsterCard;
    [SerializeField] GameObject ChooseChain;
    [SerializeField] GameObject NoGAS;
    private int currentID = 0;

    //�K�`��
    [SerializeField] GameObject Gacha;
    private Gacha GachaScript;

    //�E�H���b�g
    [SerializeField] GameObject Wallet;
    [SerializeField] GameObject CreateWallet;
    public bool isCreatedWallet = false;
    private WalletScript WalletScript;

    //�J����
    [SerializeField] GameObject Camera;


    //�h�������[��
    private TextMeshProUGUI pointText;
    private int currentPoint = 0;
    private int targetPoint = 0;
    // �h�������[���ɂ����鎞��
    public float duration = 1f;
    private float elapsedTime_roll = 0f;
    private int startPoint;

    private bool isRolling = false;

    // Start is called before the first frame update
    void Start()
    {
        audio = gameObject.GetComponent<AudioSource>();
        monsterDisplay = gameObject.GetComponent<MonsterDisplay>();
        GachaScript = gameObject.GetComponent<Gacha>();
        CameraScript = gameObject.GetComponent<CameraScript>();
        WalletScript = gameObject.GetComponent<WalletScript>();
        CurrentMonster = HaveMonsters[0];

        WalletScript.GetWalletInfo();

    }

    // Update is called once per frame
    void Update()
    {
        Text_Point.text = FormatNumberWithCommas(UnkoPoint);
        Text_CP.text = FormatNumberWithCommas(CurrentMonster.CP);
        Text_HP.text = CurrentMonster.HP + "/" + CurrentMonster.MaxHP;
        Text_EXP.text = FormatNumberWithCommas(ExpPoint) + "/" + FormatNumberWithCommas(MaxExpPoint);

        if (isRolling)
        {
            elapsedTime_roll += Time.deltaTime;

            // �C�[�W���O�֐����g�p���ă|�C���g���X�V�i�����ƌ�����\���j
            float t = elapsedTime_roll / duration;
            t = Mathf.Sin(t * Mathf.PI * 0.5f);  // 0����1�܂ł̊Ԃ�sin�֐����g�p���ăC�[�W���O

            int newPoints = (int)Mathf.Lerp(startPoint, targetPoint, t);
            //pointText.text = newPoints.ToString();
            pointText.text = FormatNumberWithCommas(newPoints);


            // �o�ߎ��Ԃ�duration�𒴂�����I��
            if (elapsedTime_roll >= duration)
            {
                isRolling = false;
                pointText.text = targetPoint.ToString();  // �ŏI�I�ȖڕW�|�C���g���Z�b�g

            }
        }
    }

    public string FormatNumberWithCommas(int number)
    {
        return number.ToString("N0"); // ���l��3����؂�Ńt�H�[�}�b�g
    }

    public void PlaySE(int ID)
    {
        audio.PlayOneShot(SEs[ID]);
    }

    public void Go_Menu()
    {
        if (monsterDisplay.isProgress)
            return;

        Menu.SetActive(true);
    }

    public void Go_Collection()
    {
        if (monsterDisplay.isProgress)
            return;

        MonsterCard.sprite = MonsterCards[0];
        Collection.SetActive(true);
        Menu.SetActive(false);
    }

    public void MonsterMint()
    {
        if (!isCreatedWallet)
        {
            Collection.SetActive(false);
            NoWallet.SetActive(true);
            return;
        }

        ChooseChain.SetActive(true);

    }

    public void SendSolana()
    {
        
        string attributes = "HP:" + AllMonsters[currentID].HP + " PoopRate:" + AllMonsters[currentID].PoopRate;
        WalletScript.MintMonsterNFT(AllMonsters[currentID].ID.ToString(), AllMonsters[currentID].ImageURL.ToString(), attributes);
        Debug.Log(attributes);
        ChooseChain.SetActive(false);

        if(WalletScript.SuccessMonsterMint == true || WalletScript.SuccessMonsterMint ==null)
        {
            return;
        }
        else
        {
            NoGAS.SetActive(true) ;
        }
    }

    public void SendSonic()
    {
        ChooseChain.SetActive(false);
    }


    public void SetMonsterCard(int ID)
    {
        currentID = ID;
        MonsterCard.sprite = MonsterCards[ID];
    }

    public void Go_Gacha()
    {
        if (monsterDisplay.isProgress)
            return;

        Gacha.SetActive(true);
        Menu.SetActive(false);
    }
   
    public void GO_Wallet()
    {
        if (monsterDisplay.isProgress)
            return;

        if (isCreatedWallet)
            WalletScript.GetWalletInfo();

        Wallet.SetActive(true);
        CreateWallet.SetActive(!isCreatedWallet);
        NoGAS.SetActive(false);
        NoWallet.SetActive(false);
        Menu.SetActive(false);
    }

    public void CreatedWallet()
    {
        CreateWallet.SetActive(false );
        isCreatedWallet = true;
    }

    public void Go_Camera()
    {
        if (monsterDisplay.isProgress)
            return;

        if (!isCreatedWallet)
        {
            NoWallet.SetActive(true);
            return;
        }

        CameraScript.CurrentMonster = CurrentMonster;
        Camera.SetActive(true);
        Main.SetActive(false);
        CameraScript.CanUpload = true;
        CameraScript.CameraStart();
    }

    public void Go_Back()
    {
        if (!GachaScript.isGacha)
        {
            PlaySE(0);
            Gacha.SetActive(false);
            Collection.SetActive(false);
            NoGAS.SetActive(false);
            Wallet.SetActive(false);
            CreateWallet.SetActive(false);
            Menu.SetActive(false);
            Camera.SetActive(false);
            NoWallet.SetActive(false);
            Main.SetActive(true);
        }
       

    }

    public void GetPoint()
    {
        StartRolling(UnkoPoint, UnkoPoint+99, Text_Point);
        UnkoPoint += 99;
        ExpPoint += 230;
        CurrentMonster.CP += 22;
        PlaySE(4);
    }

    public void StartRolling(int CurrentPoint, int TargetPoint, TextMeshProUGUI Text)
    {
        // ������
        startPoint = CurrentPoint;
        targetPoint = TargetPoint;
        pointText = Text;
        elapsedTime_roll = 0f;
        isRolling = true;
    }
}

[Serializable]
public class MonstersClass
{
    public int ID;
    public int HP;
    public int MaxHP;
    public int CP;
    public float PoopRate;
    public int GachaPercent;
    public int ProgressID;
    public Sprite[] images;
    public string ImageURL;
}