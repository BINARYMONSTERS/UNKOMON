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

        //重み付き確率で卵を排出してhaveMonstersに追加

        int randomNum = Random.Range(0, 100);
        int cumulativeProbability = 0;

        for (int i = 0; i < GachaMonsters.Count; i++)
        {
            cumulativeProbability += GachaMonsters[i].GachaPercent;

            if (randomNum < cumulativeProbability)
            {
                GachaCount++;
                GameScript.HaveMonsters.Add(GachaMonsters[i]);
                GachaMonsterImage.gameObject.transform.GetChild(0).gameObject.SetActive(true);//白
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
        float egg_shakeDuration = 0.2f; // 振動する時間
        float egg_shakeAmount = 0.1f;    // 振動の振幅（小さい値にする）
        float egg_shakeSpeed = 20f;     // 振動のスピード（速めに設定）

        Vector3 originalPosition = obj.transform.position; // 元の位置を保存
        float elapsedTime = 0.0f;

        while (elapsedTime < egg_shakeDuration)
        {
            // Mathf.Sinで左右に素早く振動させる
            float offsetX = Mathf.Sin(elapsedTime * egg_shakeSpeed) * egg_shakeAmount;
            obj.transform.position = new Vector3(originalPosition.x + offsetX, originalPosition.y, originalPosition.z);

            // 経過時間を増加させる
            elapsedTime += Time.deltaTime;

            yield return null; // 次のフレームまで待機
        }

        // 振動が終わったら元の位置に戻す
        obj.transform.position = originalPosition;
    }

    private IEnumerator Evolve(int evoID)
    {
        StartShake(true);
        // 進化前
        for (int i = 0; i < 2; i++)
        {
            GachaMonsterImage.sprite = GameScript.HaveMonsters[GameScript.HaveMonsters.Count-1].images[0]; 
            yield return new WaitForSeconds(0.2f);
            GachaMonsterImage.sprite = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1].images[1]; 
            yield return new WaitForSeconds(0.2f);
        }
        // 進化中1
        StartCoroutine(FlipMonsterImage(5));
        StartCoroutine(FadeScreen());
        yield return new WaitForSeconds(1.25f);
        GameScript.PlaySE(3);



        GameScript.HaveMonsters.RemoveAt(GameScript.HaveMonsters.Count - 1);
        monsterID = evoID;
        GameScript.HaveMonsters.Add(GameScript.AllMonsters[monsterID]);
        GameScript.monsterDisplay.currentMonsterSet = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1].images;
        GameScript.CurrentMonster = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1];
        

        // 進化中2
        StartCoroutine(FlipMonsterImage(9));
        StartCoroutine(FadeScreenOut());
        yield return new WaitForSeconds(1.85f);
        // 進化中3
        for (int i = 0; i < 3; i++)
        {
            GachaMonsterImage.sprite = GameScript.CurrentMonster.images[0]; // 普通A
            yield return new WaitForSeconds(0.3f);
            GachaMonsterImage.sprite = GameScript.CurrentMonster.images[2]; // 喜
            yield return new WaitForSeconds(0.3f);
        }

      
    }

    private IEnumerator FlipMonsterImage(int num)
    {
        // 進化中1の処理
        for (int i = 0; i < num; i++)
        {
            GachaMonsterImage.sprite = GameScript.HaveMonsters[GameScript.HaveMonsters.Count - 1].images[0];
            GachaMonsterImage.transform.localScale = new Vector3(-GachaMonsterImage.transform.localScale.x, GachaMonsterImage.transform.localScale.y, GachaMonsterImage.transform.localScale.z); // 反転
            yield return new WaitForSeconds(0.1f);
            GachaMonsterImage.transform.localScale = new Vector3(-GachaMonsterImage.transform.localScale.x, GachaMonsterImage.transform.localScale.y, GachaMonsterImage.transform.localScale.z); // 反転
            yield return new WaitForSeconds(0.1f);
        }
    }

   

    private IEnumerator FadeScreen()
    {
        // 画面のフェード処理
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
        // 画面のフェードアウト処理
        float elapsedTime = 0f;
        float duration = 1.8f;
        while (elapsedTime < duration)
        {
            SetProgressPanelAlpha(1f - (elapsedTime / duration));
            elapsedTime += Time.deltaTime;
            yield return null;
        }

        // 最終的に完全に透明にする
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
        Vector3 originalPosition = obj.localPosition; // 元の位置を保存
        float elapsedTime = 0f;

        // 振動時間中、オブジェクトをランダムに動かす
        while (elapsedTime < 3.5f)
        {
            Vector3 randomPoint = originalPosition + (Random.insideUnitSphere * 0.1f);
            obj.localPosition = new Vector3(randomPoint.x, randomPoint.y, originalPosition.z); // Z軸は固定
            elapsedTime += Time.deltaTime;

            yield return null; // 次のフレームまで待機
        }

        // 振動が終わった後、元の位置に戻す
        obj.localPosition = originalPosition;

    }
}
