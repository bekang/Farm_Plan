# Comprehensive API Technical Manual
**Version 1.0**

This document serves as the definitive technical guide for all external API services integrated into the Admin Dashboard. It details the required parameters, data structures, and common troubleshooting steps for each service.

---

## 1. Nongsaro (Rural Development Administration)
**Base URL**: `http://api.nongsaro.go.kr/service`
**Common Parameters**: 
- `apiKey`: Required for all calls.
- `serviceType`: `XML` (Default) or `JSON` (Only some services support this reliably).

### A. Variety Information (품종 정보)
*   **Endpoint**: `/varietyInfo/varietyList` (List), `/varietyInfo/varietyInfo` (Detail)
*   **Method**: `GET`
*   **Key Parameters**:
    *   `sVarietyNm`: Variety Name Filter (e.g., '고추', '아리수')
    *   `sCropNm`: Crop Name Filter
*   **Response Structure (XML)**:
    ```xml
    <response>
        <body>
            <items>
                <item>
                    <cntntsNo>Content ID (Use for detail)</cntntsNo>
                    <varietyNm>Variety Name</varietyNm>
                    <unbrngYear>Breeding Year</unbrngYear>
                </item>
            </items>
        </body>
    </response>
    ```

### B. Pest/Disease Search (병해충 검색)
*   **Endpoint**: `/sicknsInfoList/sicknsInfoList`
*   **Key Parameters**:
    *   `sicknsNm`: Disease/Pest Name (e.g., '탄저병')
    *   `cropNm`: Crop Name (e.g., '사과')
*   **Usage Tip**: Precise spelling is required. '탄저' might not match '탄저병'.

### C. Weekly Farm Info (주간농사정보)
*   **Endpoint**: `/weekFarmInfo/weekFarmInfoList`
*   **Key Parameters**:
    *   `searchYear`: YYYY (Optional)
    *   `searchMonth`: MM (Optional)
*   **Note**: Returns weekly PDF attachments and HTML content summary.

### D. Farm Machinery (농기계 구입정보)
*   **Endpoint**: `/farmMachinery/farmMachineryList`
*   **Key Parameters**:
    *   `sModelNm`: Model Name
    *   `sCompanyNm`: Manufacturer Name
*   **Result**: Returns price info, specs, and manufacturer contact.

---

## 2. Public Data Portal (Data.go.kr)

### A. Soil Environment (Chemical Property)
*   **Service**: `/SoilEnviron/SoilExam/V2`
*   **Endpoint**: `/getSoilExamList`
*   **Key Parameters**:
    *   `PNU_Code` (Recommended): 19-digit generic land code.
    *   `STDG_CD`: 10-digit Legal Dong Code (Less precise).
*   **Pitfall**: Do not mix PNU and STDG_CD. PNU takes precedence.

### B. Short-Term Weather (Village Forecast)
*   **Service**: `/1360000/VilageFcstInfoService_2.0`
*   **Endpoint**: `/getVilageFcst`
*   **Key Parameters**:
    *   `base_date`: `YYYYMMDD`
    *   `base_time`: `HHMM` (0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300)
    *   `nx`, `ny`: Grid X, Y Coordinates.
*   **Important**: You must query a `base_time` that is *past*. querying 0800 at 0759 will fail.

---

## 3. KAMIS (Korea Agro-Fisheries & Food Trade Corp)

### Daily Wholesale/Retail Price
*   **Base URL**: `http://www.kamis.or.kr/service/price/xml.do`
*   **Key Parameters**:
    *   `p_cert_key`: API Key
    *   `p_cert_id`: Certified ID
    *   `p_returntype`: `json`
    *   `p_regday`: `YYYY-MM-DD` (Date to query)
    *   `p_item_category_code`: 
        - `100`: Food Crops (Rice, Bean)
        - `200`: Vegetables (Cabbage, Radish)
        - `300`: Special Crops (Sesame)
        - `400`: Fruits (Apple, Pear)
*   **Response (JSON)**:
    ```json
    {
        "data": {
            "item": [
                {
                    "item_name": "Apple",
                    "rank": "High",
                    "price": "5,000"
                }
            ]
        }
    }
    ```
*   **Troubleshooting**: Returns `OpenAPI Error` if `p_regday` is a holiday or Sunday. Implementation should fallback to previous business day.

---

## 4. Garak Market (Seoul Agro-Fisheries)

### Electronic Auction Results
*   **Endpoint**: `/homepage/publicdata/dataJsonOpen.do`
*   **Key Parameters**:
    *   `id`: `5775` (Fixed ID)
    *   `dataid`: `data36` (Auction Result)
    *   `s_date`: `YYYYMMDD`
*   **Field Mapping**:
    *   `PUM_NM`: Item Name
    *   `U_NAME`: Unit (e.g., 10kg box)
    *   `AV_P`: Average Price
    *   `GRD_NM`: Grade (Top, High, Medium)

---

## 5. Development Guidelines
1.  **CORS Proxy**: Browser-based calls to `kamis.or.kr` or `nongsaro.go.kr` will likely fail due to CORS. Always route through a backend proxy or use a browser extension for testing.
2.  **Date Formats**: Note that KAMIS uses `YYYY-MM-DD` while others use `YYYYMMDD`.
3.  **Encoding**: Service Keys often contain special characters (`%`, `+`, `/`). Use `encodeURIComponent` carefully; some APIs expect the *already decoded* key, while others (Data Portal) expect the *encoded* key.

