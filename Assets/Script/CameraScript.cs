using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using TMPro;
using Unity.Mathematics;
using UnityEngine;
using UnityEngine.UI;
using static UnkoData;


public class CameraScript : MonoBehaviour
{

    private GameScript gameScript;
    private WalletScript walletScript;
    [NonSerialized]public MonstersClass CurrentMonster;
    [SerializeField] List<UnkoData> UnkoDataList;
    [SerializeField] List<UnkoData> UnkoDataBase;

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
    [SerializeField] TMP_InputField Text_AiResult;
    private string ExportStoolData;

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

    void Start()
    {
        gameScript = gameObject.GetComponent<GameScript>();
        walletScript = gameObject.GetComponent<WalletScript>();
        UploadButton.onClick.AddListener(Go_Loading1);
        UploadCanselButton.onClick.AddListener(UploadCansel);
        AiResultButton.onClick.AddListener(Go_Loading2);
        AiResult3Button.onClick.AddListener(EndCamera);


    }

    public void SetIsNicePoopFromJS(string value)
    {
        isNicePoop = value == "true";
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
        Text_AiResult.text = "";
        UNKO_LOADING1 .SetActive(false);
        UNKO_AIRESULT.SetActive(true);
        UNKO_AIRESULT_Slider.value = 0.5f;
        UNKO_AIRESULT_OK.SetActive(false);
        CreateData();
        DataExport();
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
    void CreateData()
    {
        System.Random random = new System.Random();

        // StoolDataのランダム生成
        UnkoData.StoolData newStoolData = new UnkoData.StoolData()
        {
            stool_id = 204888395012, // 固定の一意識別子
            photo_url = "https://example.oi/stool/photo_1010.jpg", // 画像URL
            unixtime = DateTimeOffset.UtcNow.ToUnixTimeSeconds(), // 現在時刻のUnixタイムスタンプ
            location_latitude = (decimal)(35.658584 + random.NextDouble() * 0.01), // 35.658584の付近でランダム
            location_longitude = (decimal)(139.7454316 + random.NextDouble() * 0.01), // 139.7454316の付近でランダム
            bristol_type = random.Next(1, 8), // 1〜7のランダムな整数
            color = new[] { "Brown", "Black", "Yellow", "Green" }[random.Next(0, 4)], // 色のランダム選択
            texture = new[] { "Oily", "Hard", "Soft" }[random.Next(0, 3)], // 質感のランダム選択
            floating = random.Next(0, 2) == 0, // true or falseをランダムに
            completeness = random.Next(1, 11), // 1〜10のランダムな整数
            stomach_condition = random.Next(1, 11), // 1〜10のランダムな整数
            memo = null // メモはnull
        };

        // ExternalHealthcareDataのランダム生成
        UnkoData.ExternalHealthcareData newHealthcareData = new UnkoData.ExternalHealthcareData()
        {
            meal_info = null, // 食事情報
            exercise_info = null, // 運動情報
            sleep_info = null, // 睡眠情報
        };

        // UserDataのランダム生成
        UnkoData.UserData newUserData = new UnkoData.UserData()
        {
            user_id = 3199, // 固定の一意識別子
            gender = new[] { "Male", "Female" }[random.Next(0, 2)], // 性別ランダム
            age = random.Next(20, 51), // 20〜50のランダムな年齢
            height = (decimal)(160 + random.NextDouble() * 20), // 160〜180cmのランダムな身長
            weight = (decimal)(50 + random.NextDouble() * 40), // 50〜90kgのランダムな体重
            chronic_illness = null // 慢性疾患はnull
        };

        // MappingDataのランダム生成
        UnkoData.MappingData newMappingData = new UnkoData.MappingData()
        {
            stool_id = newStoolData.stool_id, // StoolDataのIDをマッピング
            user_id = newUserData.user_id, // UserDataのIDをマッピング
            meal_info = newHealthcareData.meal_info, // Healthcareデータから参照
            exercise_info = newHealthcareData.exercise_info, // Healthcareデータから参照
            sleep_info = newHealthcareData.sleep_info // Healthcareデータから参照
        };

        // 生成したデータをリストに追加
        UnkoDataList.Add(new UnkoData()
        {
            stoolData = newStoolData,
            externalHealthcareData = newHealthcareData,
            userData = newUserData,
            mappingData = newMappingData
        });

        ExportStoolData = JsonUtility.ToJson(newStoolData, true);

        //データを転送
        walletScript.MintStoolNFT(newStoolData.stool_id.ToString(), newStoolData.photo_url.ToString(), ExportStoolData);
    }


    void DataExport()
    {
        string json = JsonUtility.ToJson(UnkoDataList,true);

        // ファイル保存先のパス (Application.persistentDataPathはプラットフォームごとに異なる安全な保存先)
        string filePath = Application.persistentDataPath + "/unko_data.json";

        // JSONデータをファイルに書き込む
        File.WriteAllText(filePath, json);

    }
}

[Serializable]
public class UnkoData
{
    public StoolData stoolData; 
    public ExternalHealthcareData externalHealthcareData; 
    public UserData userData; 
    public MappingData mappingData; 

    [System.Serializable]
    public class StoolData
    {
        public long stool_id;  // INTEGER: long型を使用し大きな数値も扱えるように
        public string photo_url;  // VARCHAR: URLやファイルパスなのでstring型
        public long unixtime;  // INTEGER: Unixタイムスタンプは秒単位のためlong型
        public decimal location_latitude;  // DECIMAL: 緯度を精度高く扱うためdecimal型
        public decimal location_longitude;  // DECIMAL: 経度を精度高く扱うためdecimal型
        public int bristol_type;  // INTEGER: 1〜7のブリストルスケールをint型で表現
        public string color;  // VARCHAR: 便の色（例: "Brown"）はstring型
        public string texture;  // VARCHAR: 質感（例: "Soft"）はstring型
        public bool floating;  // BOOLEAN: true/falseで表現
        public int completeness;  // INTEGER: 1〜10の完全度をint型で表現
        public int stomach_condition;  // INTEGER: 1〜10の胃の状態をint型で表現
        public string memo;  // TEXT: 追加メモはstring型で扱う
    }

    [System.Serializable]
    public class ExternalHealthcareData
    {
        public string meal_info;  // VARCHAR: 食事情報をstring型で扱う
        public string exercise_info;  // VARCHAR: 運動情報をstring型で扱う
        public string sleep_info;  // VARCHAR: 睡眠情報をstring型で扱う
    }

    [System.Serializable]
    public class UserData
    {
        public int user_id;  // INTEGER: ユーザーの一意識別子
        public string gender;  // VARCHAR: 性別 (例: "Male", "Female")
        public int age;  // INTEGER: 年齢 (整数)
        public decimal height;  // DECIMAL: 身長 (例: 160.5cmなど)
        public decimal weight;  // DECIMAL: 体重 (例: 70.5kgなど)
        public string chronic_illness;  // VARCHAR: 慢性疾患 (例: "糖尿病", "高血圧")
    }

    [System.Serializable]
    public class MappingData
    {
        public long stool_id;  // INTEGER: 便データの一意識別子
        public int user_id;  // INTEGER: ユーザーデータの一意識別子
        public string meal_info;  // VARCHAR: 食事情報 (外部ヘルスケアデータの参照)
        public string exercise_info;  // VARCHAR: 運動情報 (外部ヘルスケアデータの参照)
        public string sleep_info;  // VARCHAR: 睡眠情報 (外部ヘルスケアデータの参照)
    }

}