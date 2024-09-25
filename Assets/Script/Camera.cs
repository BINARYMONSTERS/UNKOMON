using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class Camera : MonoBehaviour
{

    private GameScript gameScript;
    [NonSerialized]public MonstersClass CurrentMonster;

    [SerializeField] GameObject UNKO_CAM;
    [SerializeField] GameObject NICE_POOP;

    [SerializeField] GameObject UNKO_UPLOAD;
    [SerializeField] Button UploadButton;
    [SerializeField] Button UploadCanselButton;
    public Image UploadImage1;
    public Image UploadImage2;
    public Image UploadImage3;

    [SerializeField] GameObject UNKO_LOADING1;
    [SerializeField] GameObject UNKO_LOADING1_Loading2;
    [SerializeField] GameObject UNKO_LOADING1_Loading3;
    [SerializeField] GameObject UNKO_LOADING1_Check2;
    [SerializeField] GameObject UNKO_LOADING1_Check3;
    [SerializeField] Image UNKO_LOADING1_MonsterImage;

    [SerializeField] GameObject UNKO_AIRESULT;
    [SerializeField] GameObject UNKO_AIRESULT_OK;
    [SerializeField] Slider UNKO_AIRESULT_Slider;
    [SerializeField] Button AiResultButton;

    [SerializeField] GameObject UNKO_LOADING2;
    [SerializeField] GameObject UNKO_LOADING2_Loading2;
    [SerializeField] GameObject UNKO_LOADING2_Loading3;
    [SerializeField] GameObject UNKO_LOADING2_Check2;
    [SerializeField] GameObject UNKO_LOADING2_Check3;
    [SerializeField] Image UNKO_LOADING2_MonsterImage;

    [SerializeField] GameObject UNKO_AIRESULT3;
    [SerializeField] Image UNKO_AIRESULT3_MonsterImage;
    [SerializeField] Button AiResult3Button;

    public RawImage rawImage;        // カメラ映像を表示するRawImage
    public AspectRatioFitter aspectFitter; // アスペクト比を自動調整するコンポーネント

    private WebCamTexture webCamTexture;
    public bool CanCapture = false;
    public bool isNicePoop = false;
    [SerializeField] GameObject Filter;
    public bool CanUpload = true;
    public int CaptureCount = 0;
    [SerializeField] TextMeshProUGUI Text_CaptureCount;
    public List<Texture2D> CaptureTexture;
    [DllImport("__Internal")]
    private static extern void CameraRequest();

    void Start()
    {
        gameScript = gameObject.GetComponent<GameScript>();

        UploadButton.onClick.AddListener(Go_Loading1);
        UploadCanselButton.onClick.AddListener(UploadCansel);
        AiResultButton.onClick.AddListener(Go_Loading2);
        AiResult3Button.onClick.AddListener(EndCamera);


    }
    void Update()
    {
        CanCapture = UNKO_CAM.activeSelf;

        if (!CanCapture)
        {
            isNicePoop = false;
        }

        NICE_POOP.SetActive(isNicePoop);

        if (CaptureCount == 3 && !UNKO_UPLOAD.activeSelf && CanUpload)
        {
            CanUpload = false;
            CameraStop();
            Go_Upload();
        }

        Text_CaptureCount.text = CaptureCount+1+"/"+3;

    }

    
    public void CameraStart()
    {
        // デバイスのカメラリストを取得
        WebCamDevice[] devices = WebCamTexture.devices;

        if (devices.Length > 0)
        {
            // 最初のカメラを選択（必要に応じて他のカメラを選択可能）
            webCamTexture = new WebCamTexture(devices[1].name);

            // カメラ映像をRawImageに表示
            rawImage.texture = webCamTexture;
            rawImage.material.mainTexture = webCamTexture;

            // WebCamTextureを開始


            webCamTexture.Play();

            // アスペクト比を自動調整
            if (aspectFitter != null)
            {
                aspectFitter.aspectRatio = (float)webCamTexture.width / webCamTexture.height;
            }
        }
    }

    void CameraStop()
    {
        if (webCamTexture != null)
        {
            webCamTexture.Stop();
        }
    }
    public void ChangeFilter()
    {
        Filter.SetActive(!Filter.activeSelf);
    }

    public void ChangeSlider()
    {
        UNKO_AIRESULT_OK.SetActive(true);
    }

    public void CameraCansel()
    {
        UNKO_CAM.SetActive(false);
        gameScript.Main.SetActive(true);
        CanUpload = true;
        CaptureCount = 0;
        CaptureTexture = new List<Texture2D>();
        CameraStop();
    }
    void UploadCansel()
    {
        gameScript.Main.SetActive(false);
        CanUpload = true;
        CaptureCount = 0;
        CaptureTexture = new List<Texture2D>();
        UNKO_UPLOAD.SetActive(false);
        UNKO_CAM.SetActive(true);
        CameraStart();
    }

    void Go_Upload()
    {
        gameScript.PlaySE(1);
        Sprite newSprite1 = Sprite.Create(CaptureTexture[0], new Rect(0.0f, 0.0f, CaptureTexture[0].width, CaptureTexture[0].height), new Vector2(0.5f, 0.5f));
        Sprite newSprite2 = Sprite.Create(CaptureTexture[1], new Rect(0.0f, 0.0f, CaptureTexture[0].width, CaptureTexture[0].height), new Vector2(0.5f, 0.5f));
        Sprite newSprite3 = Sprite.Create(CaptureTexture[2], new Rect(0.0f, 0.0f, CaptureTexture[0].width, CaptureTexture[0].height), new Vector2(0.5f, 0.5f));
        UploadImage1.sprite = newSprite1;
        UploadImage2.sprite = newSprite2;
        UploadImage3.sprite = newSprite3;
        gameScript.Main.SetActive(true);
        UNKO_CAM.SetActive(false);
        UNKO_UPLOAD.SetActive(true);
    }

    void Go_Loading1()
    {
        CaptureTexture = new List<Texture2D>();
        CaptureCount = 0;
        UNKO_UPLOAD.SetActive(false);
        UNKO_LOADING1.SetActive(true);
        StartCoroutine(Loading1());
    }

    private IEnumerator NormalLoop(Image image, int num)
    {
        while (true)
        {
            image.sprite = CurrentMonster.images[0]; // 普通A
            yield return new WaitForSeconds(0.6f);
            image.sprite = CurrentMonster.images[num]; // 普通B = 1
            yield return new WaitForSeconds(0.6f);
        }
        
    }

    IEnumerator Loading1()
    {
        StartCoroutine(NormalLoop(UNKO_LOADING1_MonsterImage,1));
        UNKO_LOADING1_Check2.SetActive(false);
        UNKO_LOADING1_Check3.SetActive(false);
        UNKO_LOADING1_Loading2.SetActive(false);
        UNKO_LOADING1_Loading3.SetActive(false);

        float elapsedTime = 0f;
        //2項目目が、1.5秒で一周し、チェックになる
        UNKO_LOADING1_Loading2.SetActive(true);
        while (elapsedTime < 1.5f)
        {
            UNKO_LOADING1_Loading2.transform.Rotate(0, 0, 240 * Time.deltaTime);
            elapsedTime += Time.deltaTime; // 経過時間を加算
            yield return null;  // 毎フレーム更新する
        }

        UNKO_LOADING1_Check2.SetActive(true);
       
        elapsedTime = 0f;
        yield return new WaitForSeconds(0.1f);

        //3項目目が、3秒で一周し、チェックになる
        UNKO_LOADING1_Loading3.SetActive(true);
        while (elapsedTime < 3f)
        {
            UNKO_LOADING1_Loading3.transform.Rotate(0, 0, 120 * Time.deltaTime);
            elapsedTime += Time.deltaTime; // 経過時間を加算
            yield return null;  // 毎フレーム更新する
        }

        UNKO_LOADING1_Check3.SetActive(true);
        
        //チェックになって0.5秒まって次の画面に遷移
        yield return new WaitForSeconds(0.5f);
        
        Go_AiResult();
    }

    void Go_AiResult()
    {
        UNKO_LOADING1 .SetActive(false);
        UNKO_AIRESULT.SetActive(true);
        UNKO_AIRESULT_Slider.value = 0.5f;
        UNKO_AIRESULT_OK.SetActive(false);
    }

    void Go_Loading2()
    {
        UNKO_AIRESULT.SetActive(false);
        UNKO_LOADING2.SetActive(true);
        StartCoroutine(Loading2());
    }

    IEnumerator Loading2()
    {
        StartCoroutine(NormalLoop(UNKO_LOADING2_MonsterImage, 1));
        UNKO_LOADING2_Check2.SetActive(false);
        UNKO_LOADING2_Check3.SetActive(false);
        UNKO_LOADING2_Loading2.SetActive(false);
        UNKO_LOADING2_Loading3.SetActive(false);

        float elapsedTime = 0f;
        //2項目目が、1.5秒で一周し、チェックになる
        UNKO_LOADING2_Loading2.SetActive(true);
        while (elapsedTime < 1.5f)
        {
            UNKO_LOADING2_Loading2.transform.Rotate(0, 0, 240 * Time.deltaTime);
            elapsedTime += Time.deltaTime; // 経過時間を加算
            yield return null;  // 毎フレーム更新する
        }

        UNKO_LOADING2_Check2.SetActive(true);

        elapsedTime = 0f;
        yield return new WaitForSeconds(0.1f);

        //3項目目が、3秒で一周し、チェックになる
        UNKO_LOADING2_Loading3.SetActive(true);
        while (elapsedTime < 3f)
        {
            UNKO_LOADING2_Loading3.transform.Rotate(0, 0, 120 * Time.deltaTime);
            elapsedTime += Time.deltaTime; // 経過時間を加算
            yield return null;  // 毎フレーム更新する
        }

        UNKO_LOADING2_Check3.SetActive(true);

        //チェックになって0.5秒まって次の画面に遷移
        yield return new WaitForSeconds(0.5f);

        Go_AiResult3();
    }
    
    void Go_AiResult3()
    {
        StartCoroutine(NormalLoop(UNKO_AIRESULT3_MonsterImage, 2));
        UNKO_LOADING2.SetActive(false);
        UNKO_AIRESULT3.SetActive(true);
    }

    void EndCamera()
    {
        UNKO_AIRESULT3.SetActive(false);
        gameScript.GetPoint();
        if (gameScript.CurrentMonster.ID >-1 && gameScript.CurrentMonster.ID<2)
        {
            gameScript.monsterDisplay.isProgress = true;
        }
      
    }
}
