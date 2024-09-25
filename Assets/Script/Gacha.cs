using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.SocialPlatforms;
using UnityEngine.UI;

public class Gacha : MonoBehaviour
{
    private GameScript GameScript;
    private int GachaCost = 600;
    private bool isGacha = false;
    private int GachaCount;
    [SerializeField] GameObject StartGachaString;
    [SerializeField] TextMeshProUGUI Text_GachaCount;
    [SerializeField] TextMeshProUGUI Text_Point;
    [SerializeField] Image GachaMonsterImage;
    [SerializeField] Button GachaButton;
    [SerializeField] List<MonstersClass> GachaMonsters;

    public SpriteRenderer progressPanel;
    public int monsterID = 0;
    public int EvoID = 0;

    [SerializeField] List<Transform> ShakeObjects;

    private void Start()
    {
        GameScript = gameObject.GetComponent<GameScript>();
        GachaButton.onClick.AddListener(Do_Gacha);
       
    }
    public void Do_Gacha()
    {
        if(isGacha)
        {
            return;
        }

        StartCoroutine(StartGacha());
    }

    private void Update()
    {
        Text_Point.text = GameScript.FormatNumberWithCommas(GameScript.UnkoPoint);
    }

    IEnumerator StartGacha()
    {
        if (GameScript.UnkoPoint < GachaCost)
        {
            yield break;
        }

        GameScript.UnkoPoint -= GachaCost;
        GachaCount++;
        Text_GachaCount.text= GachaCount.ToString();
        StartGachaString.SetActive(false);
        isGacha = true;

        //�d�ݕt���m���ŗ���r�o����haveMonsters�ɒǉ�

        int randomNum = Random.Range(0, 100);
        int cumulativeProbability = 0;

        for (int i = 0; i < GachaMonsters.Count; i++)
        {
            cumulativeProbability += GachaMonsters[i].GachaPercent;

            if (randomNum < cumulativeProbability)
            {
                GachaCount++;
                GameScript.HaveMonsters.Add(GachaMonsters[i]);
                GachaMonsterImage.gameObject.transform.GetChild(0).gameObject.SetActive(true);//��
                GachaMonsterImage.sprite = GachaMonsters[i].images[0];
                GachaMonsterImage.gameObject.SetActive(true);
                GameScript.PlaySE(2);
                yield return new WaitForSeconds(0.4f);
                yield return Egg_Shake(GachaMonsterImage.gameObject);
                yield return new WaitForSeconds(0.2f);
                yield return Egg_Shake(GachaMonsterImage.gameObject);
                yield return new WaitForSeconds(0.4f);
                yield return (GachaMonsterImage.gameObject.transform.GetChild(0).gameObject.GetComponent<FadeImage>().FadeOutImage(1f));
                yield return new WaitForSeconds(1f);
                GachaMonsterImage.gameObject.transform.GetChild(0).gameObject.GetComponent<FadeImage>().FadeIn();
                GachaMonsterImage.gameObject.transform.GetChild(0).gameObject.SetActive(false);

                break;
            }
        }

        yield return new WaitForSeconds(1f);

        yield return Evolve(GameScript.HaveMonsters[GameScript.HaveMonsters.Count-1].ProgressID);
        yield return new WaitForSeconds(0.2f);

        GameScript.Go_Back();
        GachaMonsterImage.gameObject.SetActive(false);
        isGacha = false;
        StartGachaString.SetActive(true);
    }

    IEnumerator Egg_Shake(GameObject obj)
    {
        float egg_shakeDuration = 0.2f; // �U�����鎞��
        float egg_shakeAmount = 0.1f;    // �U���̐U���i�������l�ɂ���j
        float egg_shakeSpeed = 20f;     // �U���̃X�s�[�h�i���߂ɐݒ�j

        Vector3 originalPosition = obj.transform.position; // ���̈ʒu��ۑ�
        float elapsedTime = 0.0f;

        while (elapsedTime < egg_shakeDuration)
        {
            // Mathf.Sin�ō��E�ɑf�����U��������
            float offsetX = Mathf.Sin(elapsedTime * egg_shakeSpeed) * egg_shakeAmount;
            obj.transform.position = new Vector3(originalPosition.x + offsetX, originalPosition.y, originalPosition.z);

            // �o�ߎ��Ԃ𑝉�������
            elapsedTime += Time.deltaTime;

            yield return null; // ���̃t���[���܂őҋ@
        }

        // �U�����I������猳�̈ʒu�ɖ߂�
        obj.transform.position = originalPosition;
    }

    private IEnumerator Evolve(int evoID)
    {
        StartShake(true);
        // �i���O
        for (int i = 0; i < 2; i++)
        {
            GachaMonsterImage.sprite = GameScript.HaveMonsters[GameScript.HaveMonsters.Count-1].images[0]; 
            yield return new WaitForSeconds(0.2f);
            GachaMonsterImage.sprite = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1].images[1]; 
            yield return new WaitForSeconds(0.2f);
        }
        // �i����1
        StartCoroutine(FlipMonsterImage(5));
        StartCoroutine(FadeScreen());
        yield return new WaitForSeconds(1.25f);
        GameScript.PlaySE(3);



        GameScript.HaveMonsters.RemoveAt(GameScript.HaveMonsters.Count - 1);
        monsterID = evoID;
        GameScript.HaveMonsters.Add(GameScript.AllMonsters[monsterID]);
        GameScript.monsterDisplay.currentMonsterSet = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1].images;
        GameScript.CurrentMonster = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1];
        

        // �i����2
        StartCoroutine(FlipMonsterImage(9));
        StartCoroutine(FadeScreenOut());
        yield return new WaitForSeconds(1.85f);
        // �i����3
        for (int i = 0; i < 3; i++)
        {
            GachaMonsterImage.sprite = GameScript.CurrentMonster.images[0]; // ����A
            yield return new WaitForSeconds(0.3f);
            GachaMonsterImage.sprite = GameScript.CurrentMonster.images[2]; // ��
            yield return new WaitForSeconds(0.3f);
        }

      
    }

    private IEnumerator FlipMonsterImage(int num)
    {
        // �i����1�̏���
        for (int i = 0; i < num; i++)
        {
            GachaMonsterImage.sprite = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1].images[0];
            GachaMonsterImage.transform.localScale = new Vector3(-GachaMonsterImage.transform.localScale.x, GachaMonsterImage.transform.localScale.y, GachaMonsterImage.transform.localScale.z); // ���]
            yield return new WaitForSeconds(0.1f);
            GachaMonsterImage.transform.localScale = new Vector3(-GachaMonsterImage.transform.localScale.x, GachaMonsterImage.transform.localScale.y, GachaMonsterImage.transform.localScale.z); // ���]
            yield return new WaitForSeconds(0.1f);
        }
    }

   

    private IEnumerator FadeScreen()
    {
        // ��ʂ̃t�F�[�h����
        float elapsedTime = 0f;
        float duration = 1.2f;
        while (elapsedTime < duration)
        {
            SetProgressPanelAlpha(elapsedTime / duration);
            elapsedTime += Time.deltaTime;
            yield return null;
        }
    }

    private IEnumerator FadeScreenOut()
    {
        // ��ʂ̃t�F�[�h�A�E�g����
        float elapsedTime = 0f;
        float duration = 1.8f;
        while (elapsedTime < duration)
        {
            SetProgressPanelAlpha(1f - (elapsedTime / duration));
            elapsedTime += Time.deltaTime;
            yield return null;
        }

        // �ŏI�I�Ɋ��S�ɓ����ɂ���
        SetProgressPanelAlpha(0f);
    }

    private void SetProgressPanelAlpha(float alpha)
    {
        Color color = progressPanel.color;
        color.a = alpha;
        progressPanel.color = color;
    }

    public void StartShake(bool Trade)
    {
        foreach (Transform obj in ShakeObjects)
        {
            StartCoroutine(ShakeObject(obj));
        }
    }

    IEnumerator ShakeObject(Transform obj)
    {
        Vector3 originalPosition = obj.localPosition; // ���̈ʒu��ۑ�
        float elapsedTime = 0f;

        // �U�����Ԓ��A�I�u�W�F�N�g�������_���ɓ�����
        while (elapsedTime < 3.5f)
        {
            Vector3 randomPoint = originalPosition + (Random.insideUnitSphere * 0.1f);
            obj.localPosition = new Vector3(randomPoint.x, randomPoint.y, originalPosition.z); // Z���͌Œ�
            elapsedTime += Time.deltaTime;

            yield return null; // ���̃t���[���܂őҋ@
        }

        // �U�����I�������A���̈ʒu�ɖ߂�
        obj.localPosition = originalPosition;

    }
}
