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
    //抽出したい色のHSV形式での下限ベクトル
    //private readonly static Scalar LOWER = new Scalar(0, 0, 200);
    //抽出したい色のHSV形式での上限ベクトル
    //private readonly static Scalar UPPER = new Scalar(180, 50, 255);

    // 茶色、黒色、緑色、黄色のHSV形式での下限・上限ベクトルを定義
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
        // WebCamTextureの縦横比
        var webCamTexture = input_image.texture as WebCamTexture;
        if (webCamTexture == null) return;

        float textureWidth = webCamTexture.width;
        float textureHeight = webCamTexture.height;
        float textureAspectRatio = textureWidth / textureHeight;

        // RawImageのRectTransformを取得
        RectTransform rawImageRectTransform = input_image.GetComponent<RectTransform>();

        // RawImageの現在のサイズ
        float rawImageWidth = rawImageRectTransform.rect.width;
        float rawImageHeight = rawImageRectTransform.rect.height;
        float rawImageAspectRatio = rawImageWidth / rawImageHeight;

        // トリミングのための比率調整
        if (textureAspectRatio > rawImageAspectRatio)
        {
            // テクスチャの横が長いので左右をトリミング
            float scaleFactor = rawImageAspectRatio / textureAspectRatio;
            input_image.uvRect = new Rect((1f - scaleFactor) / 2f, 0, scaleFactor, 1f);
        }
        else
        {
            // テクスチャの縦が長いので上下をトリミング
            float scaleFactor = textureAspectRatio / rawImageAspectRatio;
            input_image.uvRect = new Rect(0, (1f - scaleFactor) / 2f, 1f, scaleFactor);
        }
    }

    void Update()
    {
        if (CameraScript.CanCapture)
        {
            // WebCamTextureからTexture2Dに変換する
            var webCamTexture = input_image.texture as WebCamTexture;
            if (webCamTexture == null)
            {
                return;
            }

            // 縦横比を調整
            AdjustRawImageAspect();

            // WebCamTextureのピクセルデータを取得し、Texture2Dにコピーする
            input_texture = new Texture2D(webCamTexture.width, webCamTexture.height);
            input_texture.SetPixels32(webCamTexture.GetPixels32());
            input_texture.Apply();

            if (input_texture == null)
            {
                return;
            }

            // OpenCVでの色検出処理
            originMat = OpenCvSharp.Unity.TextureToMat(input_texture);
            hsvMat = new Mat();
            Cv2.CvtColor(originMat, hsvMat, ColorConversionCodes.BGR2HSV);

            // 茶色の検出
            Mat binaryBrown = hsvMat.InRange(LOWER_BROWN, UPPER_BROWN);
            bool isBrownDetected = CheckColorExists(binaryBrown);

            // 黒色の検出
            Mat binaryBlack = hsvMat.InRange(LOWER_BLACK, UPPER_BLACK);
            bool isBlackDetected = CheckColorExists(binaryBlack);

            // 緑色の検出
            Mat binaryGreen = hsvMat.InRange(LOWER_GREEN, UPPER_GREEN);
            bool isGreenDetected = CheckColorExists(binaryGreen);

            // 黄色の検出
            Mat binaryYellow = hsvMat.InRange(LOWER_YELLOW, UPPER_YELLOW);
            bool isYellowDetected = CheckColorExists(binaryYellow);

            // 検出した色を二値化テクスチャとして表示
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

            // 検出結果を基に処理を行う
            CameraScript.isNicePoop = isBrownDetected || isBlackDetected || isGreenDetected || isYellowDetected;
        }
    }

    private bool CheckColorExists(Mat binaryMat)
    {
        // 二値化された画像の白（255）のピクセル数をカウント
        int whitePixelsCount = Cv2.CountNonZero(binaryMat);

        // 白いピクセル（抽出された色）が1つでも存在するかを判定

        if(whitePixelsCount > 10)// 閾値は調整可能
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
