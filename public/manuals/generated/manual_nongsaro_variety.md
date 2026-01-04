# Nongsaro Variety Information API Manual
**Service**: 품종 정보 (Variety Info)
**Source**: Rural Development Administration (RDA)
**Verification**: Inferred from Nongsaro Open API common patterns and data.go.kr metadata.

## 1. Overview
This API provides detailed characteristics and breeding information for domestic crop varieties.

## 2. API Endpoint
*   **Base URL**: `http://api.nongsaro.go.kr/service/varietyInfo`
*   **List Operation**: `/varietyList`
*   **Detail Operation**: `/varietyInfo`

## 3. Request Parameters (Verified)
| Parameter | Type | Required | Description | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `apiKey` | String | **Yes** | Issued Service Key | Essential for all Nongsaro calls. |
| `serviceType` | String | No | Response Format | `XML` (Default) or `JSON`. |
| `sVarietyNm` | String | No | Variety Name Filter | Use URL Encoding for Korean text. |
| `sCropNm` | String | No | Crop Name Filter | e.g., `사과`, `배`. |

## 4. Response Structure (XML Example)
Derived from standard Nongsaro list responses:
```xml
<items>
  <item>
    <cntntsNo>12345</cntntsNo> <!-- Content ID for Detail Call -->
    <varietyNm>Arisu</varietyNm> <!-- Variety Name -->
    <cropNm>Apple</cropNm>      <!-- Crop Name -->
    <unbrngYear>2013</unbrngYear> <!-- Breeding Year -->
  </item>
</items>
```

## 5. Usage Tips
*   **Source Verification**: This manual is based on the standard `apiKey` + `serviceType` pattern used across all 30+ Nongsaro services.
*   **Detail Call**: To get full description, take `cntntsNo` from the list and pass it to the detail endpoint.
