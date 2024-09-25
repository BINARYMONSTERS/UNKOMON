using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEngine.UI;
using Unity.Sentis;
using HoloLab.DNN.ObjectDetection;
using Unity.VisualScripting;

namespace Sample
{
    public class ObjectDetection : MonoBehaviour
    {
        private GameScript gameScript;
        [SerializeField] Camera CameraScript;
        
       
        [SerializeField, Tooltip("Input Image")] private RawImage input_image = null;
        [SerializeField, Tooltip("Weights")] private ModelAsset weights = null;
        [SerializeField, Tooltip("Label List")] private TextAsset names = null;
        [SerializeField, Tooltip("Confidence Score Threshold"), Range(0.0f, 1.0f)] private float score_threshold = 0.6f;
        [SerializeField, Tooltip("IoU Threshold"), Range(0.0f, 1.0f)] private float iou_threshold = 0.4f;

        //private HoloLab.DNN.ObjectDetection.ObjectDetectionModel_YOLOX model;
        private HoloLab.DNN.ObjectDetection.ObjectDetectionModel_YOLOv9 model;
        private Font font;
        private Color color_offset;
        private List<Color> colors;
        private List<string> labels;
        private Texture2D input_texture;



        private void Start()
        {
            gameScript = CameraScript.gameObject.GetComponent<GameScript>();
            
            model = new HoloLab.DNN.ObjectDetection.ObjectDetectionModel_YOLOv9(weights);
            model.ApplyQuantize();

            // Read Label List from Text Asset
            labels = new List<string>(Regex.Split(names.text, "\r\n|\r|\n"));

            // Get Font and Create Colors for Visualize
            try
            {
                font = Resources.GetBuiltinResource(typeof(Font), "Arial.ttf") as Font;
            }
            catch
            {
                font = Resources.GetBuiltinResource(typeof(Font), "LegacyRuntime.ttf") as Font;
            }
            colors = HoloLab.DNN.ObjectDetection.Visualizer.GenerateRandomColors(labels.Count);
            color_offset = new Color(0.5f, 0.5f, 0.5f, 0.0f);
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



        private void Update()
        {
            if(CameraScript.CanCapture)
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

                // Detect Objects
                var objects = model.Detect(input_texture, score_threshold, iou_threshold);

                // Show Objects on Unity Console
                objects.ForEach(o => Debug.Log($"{o.class_id} {labels[o.class_id]} ({o.score:F2}) : {o.rect}"));

                if (objects.Count > 0)
                {
                    CameraScript.isNicePoop = true;
                }
                else
                {
                    CameraScript.isNicePoop = false;
                }
            }
        }

        public void OnClick()
        {
            if (CameraScript.isNicePoop)
            {
                gameScript.PlaySE(5);
                CameraScript.CaptureCount++;
                CameraScript.CaptureTexture.Add(input_texture);
            }
            else
            {
                return;
            }

        }

       
        private void OnDestroy()
        {
            model?.Dispose();
            model = null;
        }
    }
}
