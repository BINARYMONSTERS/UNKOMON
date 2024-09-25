using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class FadeImage : MonoBehaviour
{
    private Image imageToFade; // �����x��������Ώۂ�Image
   // public float duration = 1f; // n�b�����ē����x��0�ɂ���

    private void Start()
    {
        imageToFade = gameObject.GetComponent<Image>();
    }
    // �R���[�`���œ����x��0�ɂ��鏈��
    public void StartFadeOut()
    {
        //StartCoroutine(FadeOutImage());
    }

    public IEnumerator FadeOutImage(float duration)
    {
        Color originalColor = imageToFade.color; // ���̐F��ۑ�
        float elapsedTime = 0.0f;

        while (elapsedTime < duration)
        {
            // �o�ߎ��ԂɊ�Â��ăA���t�@�l������������
            float newAlpha = Mathf.Lerp(originalColor.a, 0f, elapsedTime / duration);
            imageToFade.color = new Color(originalColor.r, originalColor.g, originalColor.b, newAlpha);

            elapsedTime += Time.deltaTime; // �o�ߎ��Ԃ����Z
            yield return null; // ���̃t���[���܂őҋ@
        }

        // �Ō�ɓ����x�����S��0�ɐݒ�
        imageToFade.color = new Color(originalColor.r, originalColor.g, originalColor.b, 0f);

    }

    public void FadeIn()
    {
        Color originalColor = imageToFade.color; // ���̐F��ۑ�
        imageToFade.color = new Color(originalColor.r, originalColor.g, originalColor.b, 1f);
    }
}
