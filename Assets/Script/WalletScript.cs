using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;

public class WalletScript : MonoBehaviour
{
    private GameScript GameScript;
    public bool SuccessMonsterMint = true;
    public WalletInfo walletInfo;
    [SerializeField] TextMeshProUGUI Text_PublicKey;
    [SerializeField] TextMeshProUGUI Text_SOL;
    [SerializeField] TextMeshProUGUI Text_UNKO;

    void Start()
    {
        GameScript = gameObject.GetComponent<GameScript>();

    }

    public IEnumerator MintMonsterNFT(string name, string imageUrl, string attributesJson)
    {
        yield return MintMonsterNFTCoroutine(name, imageUrl, attributesJson);
    }

    IEnumerator MintMonsterNFTCoroutine(string name, string imageUrl, string attributesJson)
    {
        string url = "http://localhost:3000/api/mint-monster";
        WWWForm form = new WWWForm();
        form.AddField("name", name);
        form.AddField("imageUrl", imageUrl);
        form.AddField("attributes", attributesJson);

        UnityWebRequest request = UnityWebRequest.Post(url, form);
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            SuccessMonsterMint = false;
            Debug.LogError("Error: " + request.error);
        }
        else
        {
            SuccessMonsterMint = true;
            Debug.Log("Monster NFT minted successfully: " + request.downloadHandler.text);
        }
    }

    public void MintStoolNFT(string name, string imageUrl, string attributesJson)
    {
        StartCoroutine(MintStoolNFTCoroutine(name, imageUrl, attributesJson));
    }

    IEnumerator MintStoolNFTCoroutine(string name, string imageUrl, string attributesJson)
    {
        string url = "http://localhost:3000/api/mint-stool";
        WWWForm form = new WWWForm();
        form.AddField("name", name);
        form.AddField("imageUrl", imageUrl);
        form.AddField("attributes", attributesJson);

        UnityWebRequest request = UnityWebRequest.Post(url, form);
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError("Error: " + request.error);
        }
        else
        {
            Debug.Log("Stool NFT minted successfully: " + request.downloadHandler.text);
        }
    }
    public void CreateWallet()
    {
        StartCoroutine(CreateWalletCoroutine());
    }

    IEnumerator CreateWalletCoroutine()
    {
        string url = "http://localhost:3000/api/create-wallet";
        UnityWebRequest request = UnityWebRequest.PostWwwForm(url, "");
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError("Error: " + request.error + " - Response Code: " + request.responseCode);
        }
        else
        {
            Debug.Log("Wallet created successfully: " + request.downloadHandler.text);
            GetWalletInfo();
            GameScript.CreatedWallet();
        }
    }

    public void GetWalletInfo()
    {
        StartCoroutine(GetWalletInfoCoroutine());
    }

    IEnumerator GetWalletInfoCoroutine()
    {
        string url = "http://localhost:3000/api/get-wallet";
        UnityWebRequest request = UnityWebRequest.Get(url);

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            GameScript.isCreatedWallet = false;
            Debug.LogError("Error: " + request.error);
        }
        else
        {
            GameScript.isCreatedWallet = true;
            // 取得したJSONデータをパースしてWalletInfoに格納する
            string json = request.downloadHandler.text;
            walletInfo = JsonUtility.FromJson<WalletInfo>(json);
            SetText(walletInfo);
            Debug.Log("Wallet Info: " + walletInfo.publicKey);
        }
    }

    private void SetText(WalletInfo walletInfo)
    {
        string formattedKey = walletInfo.publicKey.Substring(0, 5) + "..." + walletInfo.publicKey.Substring(walletInfo.publicKey.Length - 5);
        Text_PublicKey.text = formattedKey;
        Text_SOL.text = walletInfo.sol.ToString();
        Text_UNKO.text = GameScript.UnkoPoint.ToString();
    }
}

[Serializable]
public class WalletInfo
{
    public string publicKey;
    public List<int> secretKey;
    public float sol;
}