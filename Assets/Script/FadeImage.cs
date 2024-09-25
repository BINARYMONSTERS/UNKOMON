using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class FadeImage : MonoBehaviour
{
    private Image imageToFade; // 透明度を下げる対象のImage
   // public float duration = 1f; // n秒かけて透明度を0にする

    private void Start()
    {
        imageToFade = gameObject.GetComponent<Image>();
    }
    // コルーチンで透明度を0にする処理
    public void StartFadeOut()
    {
        //StartCoroutine(FadeOutImage());
    }

    public IEnumerator FadeOutImage(float duration)
    {
        Color originalColor = imageToFade.color; // 元の色を保存
        float elapsedTime = 0.0f;

        while (elapsedTime < duration)
        {
            // 経過時間に基づいてアルファ値を減少させる
            float newAlpha = Mathf.Lerp(originalColor.a, 0f, elapsedTime / duration);
            imageToFade.color = new Color(originalColor.r, originalColor.g, originalColor.b, newAlpha);

            elapsedTime += Time.deltaTime; // 経過時間を加算
            yield return null; // 次のフレームまで待機
        }

        // 最後に透明度を完全に0に設定
        imageToFade.color = new Color(originalColor.r, originalColor.g, originalColor.b, 0f);

    }

    public void FadeIn()
    {
        Color originalColor = imageToFade.color; // 元の色を保存
        imageToFade.color = new Color(originalColor.r, originalColor.g, originalColor.b, 1f);
    }
}
