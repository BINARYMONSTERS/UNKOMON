using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using OpenCvSharp;
using UnityEngine.UI;
using Rect = UnityEngine.Rect;

public class Detection : MonoBehaviour
{
    private GameScript GameScript;
    private CameraScript CameraScript;
    [SerializeField] RawImage input_image;
    private WebCamTexture webCamTexture;
    private Mat originMat;
    private Mat hsvMat;
    private Mat binaryData;
    [SerializeField] Texture2D binaryTexture;
    private Texture2D input_texture;
    //���o�������F��HSV�`���ł̉����x�N�g��
    //private readonly static Scalar LOWER = new Scalar(0, 0, 200);
    //���o�������F��HSV�`���ł̏���x�N�g��
    //private readonly static Scalar UPPER = new Scalar(180, 50, 255);

    // ���F�A���F�A�ΐF�A���F��HSV�`���ł̉����E����x�N�g�����`
    private readonly static Scalar LOWER_BROWN = new Scalar(10, 100, 20);
    private readonly static Scalar UPPER_BROWN = new Scalar(30, 255, 200);

    private readonly static Scalar LOWER_BLACK = new Scalar(0, 0, 0);
    private readonly static Scalar UPPER_BLACK = new Scalar(180, 255, 50);

    private readonly static Scalar LOWER_GREEN = new Scalar(35, 100, 50);
    private readonly static Scalar UPPER_GREEN = new Scalar(85, 255, 255);

    private readonly static Scalar LOWER_YELLOW = new Scalar(20, 100, 100);
    private readonly static Scalar UPPER_YELLOW = new Scalar(30, 255, 255);

    void Start()
    {
        CameraScript = gameObject.GetComponent<CameraScript>();
        GameScript = gameObject.GetComponent<GameScript>();
        
    }
    private void AdjustRawImageAspect()
    {
        // WebCamTexture�̏c����
        var webCamTexture = input_image.texture as WebCamTexture;
        if (webCamTexture == null) return;

        float textureWidth = webCamTexture.width;
        float textureHeight = webCamTexture.height;
        float textureAspectRatio = textureWidth / textureHeight;

        // RawImage��RectTransform���擾
        RectTransform rawImageRectTransform = input_image.GetComponent<RectTransform>();

        // RawImage�̌��݂̃T�C�Y
        float rawImageWidth = rawImageRectTransform.rect.width;
        float rawImageHeight = rawImageRectTransform.rect.height;
        float rawImageAspectRatio = rawImageWidth / rawImageHeight;

        // �g���~���O�̂��߂̔䗦����
        if (textureAspectRatio > rawImageAspectRatio)
        {
            // �e�N�X�`���̉��������̂ō��E���g���~���O
            float scaleFactor = rawImageAspectRatio / textureAspectRatio;
            input_image.uvRect = new Rect((1f - scaleFactor) / 2f, 0, scaleFactor, 1f);
        }
        else
        {
            // �e�N�X�`���̏c�������̂ŏ㉺���g���~���O
            float scaleFactor = textureAspectRatio / rawImageAspectRatio;
            input_image.uvRect = new Rect(0, (1f - scaleFactor) / 2f, 1f, scaleFactor);
        }
    }

    void Update()
    {
        if (CameraScript.CanCapture)
        {
            // WebCamTexture����Texture2D�ɕϊ�����
            var webCamTexture = input_image.texture as WebCamTexture;
            if (webCamTexture == null)
            {
                return;
            }

            // �c����𒲐�
            AdjustRawImageAspect();

            // WebCamTexture�̃s�N�Z���f�[�^���擾���ATexture2D�ɃR�s�[����
            input_texture = new Texture2D(webCamTexture.width, webCamTexture.height);
            input_texture.SetPixels32(webCamTexture.GetPixels32());
            input_texture.Apply();

            if (input_texture == null)
            {
                return;
            }

            // OpenCV�ł̐F���o����
            originMat = OpenCvSharp.Unity.TextureToMat(input_texture);
            hsvMat = new Mat();
            Cv2.CvtColor(originMat, hsvMat, ColorConversionCodes.BGR2HSV);

            // ���F�̌��o
            Mat binaryBrown = hsvMat.InRange(LOWER_BROWN, UPPER_BROWN);
            bool isBrownDetected = CheckColorExists(binaryBrown);

            // ���F�̌��o
            Mat binaryBlack = hsvMat.InRange(LOWER_BLACK, UPPER_BLACK);
            bool isBlackDetected = CheckColorExists(binaryBlack);

            // �ΐF�̌��o
            Mat binaryGreen = hsvMat.InRange(LOWER_GREEN, UPPER_GREEN);
            bool isGreenDetected = CheckColorExists(binaryGreen);

            // ���F�̌��o
            Mat binaryYellow = hsvMat.InRange(LOWER_YELLOW, UPPER_YELLOW);
            bool isYellowDetected = CheckColorExists(binaryYellow);

            // ���o�����F���l���e�N�X�`���Ƃ��ĕ\��
            if (isBrownDetected)
            {
                binaryTexture = OpenCvSharp.Unity.MatToTexture(binaryBrown);
                //input_image.texture = binaryTexture;
            }
            else if (isBlackDetected)
            {
                binaryTexture = OpenCvSharp.Unity.MatToTexture(binaryBlack);
                //input_image.texture = binaryTexture;
            }
            else if (isGreenDetected)
            {
                binaryTexture = OpenCvSharp.Unity.MatToTexture(binaryGreen);
                //input_image.texture = binaryTexture;
            }
            else if (isYellowDetected)
            {
                binaryTexture = OpenCvSharp.Unity.MatToTexture(binaryYellow);
                //input_image.texture = binaryTexture;
            }

            // ���o���ʂ���ɏ������s��
            CameraScript.isNicePoop = isBrownDetected || isBlackDetected || isGreenDetected || isYellowDetected;
        }
    }

    private bool CheckColorExists(Mat binaryMat)
    {
        // ��l�����ꂽ�摜�̔��i255�j�̃s�N�Z�������J�E���g
        int whitePixelsCount = Cv2.CountNonZero(binaryMat);

        // �����s�N�Z���i���o���ꂽ�F�j��1�ł����݂��邩�𔻒�

        if(whitePixelsCount > 10)// 臒l�͒����\
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }

    public void OnClick()
    {
        if (CameraScript.isNicePoop)
        {
            GameScript.PlaySE(5);
            CameraScript.CaptureCount++;
            CameraScript.CaptureTexture.Add(input_texture);
        }

    }
}
