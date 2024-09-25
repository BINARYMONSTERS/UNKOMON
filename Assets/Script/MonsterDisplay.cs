using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MonsterDisplay : MonoBehaviour
{
    public Sprite[] currentMonsterSet; // 0:����A 1:����B 2:�� 3:�{ 4:�� 5:�y

    private GameScript GameScript;
    public int monsterID = 0;
    public Image monsterImage;
    public bool isProgress = false;
    private Coroutine currentCoroutine;
    public SpriteRenderer progressPanel;
    [SerializeField] List<Transform> ShakeObjects;
    void Start()
    {
        GameScript = GetComponent<GameScript>();
        StartNormalLoop();
    }

    void Update()
    {
        
        if (currentCoroutine == null)
        {
            if (isProgress)
            {
                StartProgressLoop();
            }
            else
            {
                StartNormalLoop();
            }
        }
    }

    private void StartNormalLoop()
    {
        if (currentCoroutine != null) StopCoroutine(currentCoroutine);
        currentCoroutine = StartCoroutine(NormalLoop());
    }

  

    private void StartProgressLoop()
    {
        if (currentCoroutine != null) StopCoroutine(currentCoroutine);
        currentCoroutine = StartCoroutine(Evolve(GameScript.CurrentMonster.ProgressID));
    }


    private IEnumerator NormalLoop()
    {
        while (true)
        {
            if (isProgress) break; // ���̃A�j���[�V�����ɐ؂�ւ��邽�߂Ƀ��[�v�𔲂���
            monsterImage.sprite = currentMonsterSet[0]; // ����A
            yield return new WaitForSeconds(0.6f);
            monsterImage.sprite = currentMonsterSet[1]; // ����B
            yield return new WaitForSeconds(0.6f);
        }
        currentCoroutine = null;
    }

   

    private IEnumerator Evolve(int evoID)
    {
        StartShake(true);
        // �i���O
        for (int i = 0; i < 2; i++)
        {
            monsterImage.sprite = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1].images[0];
            yield return new WaitForSeconds(0.2f);
            monsterImage.sprite = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1].images[1];
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
            monsterImage.sprite = GameScript.CurrentMonster.images[0]; // ����A
            yield return new WaitForSeconds(0.3f);
            monsterImage.sprite = GameScript.CurrentMonster.images[2]; // ��
            yield return new WaitForSeconds(0.3f);
        }

        currentCoroutine = null;
        isProgress = false;
    }

    private IEnumerator FlipMonsterImage(int num)
    {
        // �i����1�̏���
        for (int i = 0; i < num; i++)
        {
            monsterImage.sprite = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1].images[0];
            monsterImage.transform.localScale = new Vector3(-monsterImage.transform.localScale.x, monsterImage.transform.localScale.y, monsterImage.transform.localScale.z); // ���]
            yield return new WaitForSeconds(0.1f);
            monsterImage.transform.localScale = new Vector3(-monsterImage.transform.localScale.x, monsterImage.transform.localScale.y, monsterImage.transform.localScale.z); // ���]
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
