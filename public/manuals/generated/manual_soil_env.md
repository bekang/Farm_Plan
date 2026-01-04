# Soil Environment API Manual
**Service**: 토양 검정 정보 (Soil Info)
**Source**: Public Data Portal (RDA)
**Verification**: Verified parameter `PNU_Code` via data.go.kr metadata.

## 1. Overview
Provides chemical property data (pH, Organic Matter) for specific land parcels.

## 2. API Endpoint
*   **Base URL**: `http://apis.data.go.kr/1390802/SoilEnviron/SoilExam/V2`
*   **Operation**: `/getSoilExamList`

## 3. Request Parameters (Verified)
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `serviceKey` | String | **Yes** | API Key | `...` |
| `PNU_Code` | String | **Conditional**| 19-digit Land Code | `42150..` |
| `STDG_CD` | String | **Conditional**| 10-digit Dong Code | `51150..` |
| `type` | String | No | Format | `xml` |

## 4. Parameter Specifics
*   **PNU_Code**: Represents a specific parcel (Jimok + Bunji). High precision.
*   **STDG_CD**: Represents a legal administrative area (Dong/Ri). Broader search.
*   *Note*: Providing both may cause conflict; prioritize `PNU_Code` for specific farm analysis.

## 5. Response Data Fields
*   `ACID`: Acidity (pH)
*   `OM`: Organic Matter
*   `PHOS`: Valid Phosphate
*   `SILIC`: Valid Silicic Acid

## 6. Official Reference
*   Data Portal: [Soil Environment Service](https://www.data.go.kr/data/15000000/openapi.do)
