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
    private Camera CameraScript;
    //���C��
    public GameObject Main;
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

    //�K�`��
    [SerializeField] GameObject Gacha;
    private Gacha GachaScript;

    //�E�H���b�g
    [SerializeField] GameObject Wallet;

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
        CameraScript = gameObject.GetComponent<Camera>();
        CurrentMonster = HaveMonsters[0];
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
        Menu.SetActive(true);
    }

    public void Go_Collection()
    {
        MonsterCard.sprite = MonsterCards[0];
        Collection.SetActive(true);
        Menu.SetActive(false);
    }

    public void SetMonsterCard(int ID)
    {
        MonsterCard.sprite = MonsterCards[ID];
    }

    public void Go_Gacha()
    {
        Gacha.SetActive(true);
        Menu.SetActive(false);
    }
   
    public void GO_Wallet()
    {
        Wallet.SetActive(true);
        Menu.SetActive(false);
    }

    public void Go_Camera()
    {
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
            Wallet.SetActive(false);
            Menu.SetActive(false);
            Camera.SetActive(false);
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
    public int GachaPercent;
    public int ProgressID;
    public Sprite[] images;

}