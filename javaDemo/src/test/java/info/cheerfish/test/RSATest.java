package info.cheerfish.test;

import info.cheerfish.common.utils.crypto.RSA;
import org.apache.commons.codec.binary.Base64;

import java.nio.charset.StandardCharsets;

/**
 * @author Masker                    -
 * @description TODO entry class function .....
 * @date 2022/5/9 16:11
 */

public class RSATest {
    private static final String pubKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAscAFLXXtrmEznS+i8DYrBOaI0jER1MFEt9+ozqPJJv3DPbAxfknwl3zTJaffQdt4q/hMZd7yYbyLBcvIC8u/gHyWulFqW/I18NiSnwt36sC3y5CfQ4GqS1kufqticlZk2TYbkePlz3lk7mWgHMIcfYkN6tbJX2a/EjlKKFlxqE+pmp107pwX6Ct65NgtJAgqPV8UgRNTORK6tyxmc853mU/YTkki/RenYPWTEETFxC7CN5RfHAGQzk9qWiPIYTsa4/6zW+ConjMyfwV0RaNzLF5xOL0+rEO2WarSv3HTWAixo2eveF+1NP7pr8jb81QfvSJvIklIyFqigYnZHvD70QIDAQAB";
    private static final String priKey = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxwAUtde2uYTOdL6LwNisE5ojSMRHUwUS336jOo8km/cM9sDF+SfCXfNMlp99B23ir+Exl3vJhvIsFy8gLy7+AfJa6UWpb8jXw2JKfC3fqwLfLkJ9DgapLWS5+q2JyVmTZNhuR4+XPeWTuZaAcwhx9iQ3q1slfZr8SOUooWXGoT6manXTunBfoK3rk2C0kCCo9XxSBE1M5Erq3LGZzzneZT9hOSSL9F6dg9ZMQRMXELsI3lF8cAZDOT2paI8hhOxrj/rNb4KieMzJ/BXRFo3MsXnE4vT6sQ7ZZqtK/cdNYCLGjZ694X7U0/umvyNvzVB+9Im8iSUjIWqKBidke8PvRAgMBAAECggEAFKSDNWtbpgO91cRhfNodlt0bCKYQNxAW5e/Aj/bvdmrEENb0eIEnwsAJWXcsc16Enhwg6zfAGF+oGY039z67R7WwX4TzACiZ4RWVuYjAbW/iKG7sQA+/8i4yOx22OicUYTFqdD/uQXEMqq78sDpOyrlu91XoXv70s64ZkaQJkg00vDOOD7rc38aw5Ov3KJhJWxIR8qP8iWo+SKcb6gwbLOwUeyQrvJvAkYSk82HsznXhQ78r/20tLWW0zaODdJyhL0lVLa2rdWkmFdMAA/H6KZ3pnre8MkUcealLzTt7mLYLOzp0XVt65uZErw8q4Hygd3xWcp2admdCsA2J25v+AQKBgQDg+7qlBZvv0w7CWsdM8FYF1ujJvvguZamOnU+5e3KDvlJGceNoRTs979bMrgv+m1VLmSp8Sn7ZlMyif+V0DcZ/f2bPFcTjAym06nzb2Kl/JZDxmTewR9mKAhRVymCOOqu1DuV/3MEZl1lNBcY4+AzIcAkAClQ/JT/oK2ncCqC5YQKBgQDKQU1cVDMYFYfLOFYYUh79CN+r6EjZO7jU0gDZMhO6xmWf4SbVxMK1WSGEbGrjd7w+Sra32IA9cdqye3tGGA1i6/V71c3341VBNJGMQGA8ONmQ0sUykSxcFB9nHC0PBbInWvf9xDBxW1h3UVGDnHoQoQ9prgmE4KIS/Tf5RggocQKBgQC33SGYsW/R3AOI1FViTFuQ5CRUk+wRRuX99hPserWIcyacCYEWetXCdVpu5aJJzjoz0RXGg78NJCzkdG9Zm9Rn5/9mJ91CxRf1kVi+9l722QWOXHAFcYKX5cEmp4CnW81t56GpEAkDWAwUBS8M6bLQr7a7QLW+8Ts8Cxa1TD4zoQKBgGu3AZNViGygMtTpKPkE61oJWs38BKgk5Vf6i9cgk19agA744yzgAG6CjJYxA3AneYqXUd5xoEKZG0cI+msnLiHr1q5f/LSzTtlOPOG7+0S3Zi96AOngZQaY9Ox+FgU1HF9XVFHDJaWJZ4EMPuRf9qZakJHQzWMGG2sPjrrkMD4RAoGAAw8PEKQL6WrmibMLHDHz69ay4p2P20Kx2sSXss0z0YFkHt4WAFAnEcN1NFa9AidQ4LXglDQgbSn7EqlhDodx6gwXrK5z5PmPwXMps3jGzYLOeZsIRbCfQ+3/S6xFUZJ5pacAQ8tw0ULlfpKTr6VcoMLt2Ml5e1+I06YyG1YdfuI=";

    public static void main(String[] args) throws Exception {
        byte[] pub = Base64.decodeBase64(pubKey);
        byte[] pri = Base64.decodeBase64(priKey);
        byte[] encrypted = Base64.decodeBase64("Cfa/QScqe6MZWPvLmkGHmRipF9WdzMZS2lcOxJO/D83mCLcolVyo2Y5m1w1N84o+3jJKSpahLPqC10Nqk3kvJlei23dkMAbuAz1MJgLMwLg65f1z+NXFc3GEePy6rVmNtvyfcz7I9zmbSce/oCmEwiWpo+vQ3HLK736hOdQCxHj8hsLkGFXFHNU0urdBEU+eL0j5zKUckLtaGXli/YEBFSRvwBauG9VZhKKe5bbr7wJ2R5zJO5jZyVLXHyG7jXEVSCTLRyUuvOV4KabIEWlCQsyZehuyrIcq7mklaFs5nhyDOixN8JrKseuvJqaL2jzmrWnINJSxQjKPqeSROIAiAw==");
        byte[] decrypted = RSA.decryptByPri(encrypted, pri);
        System.out.println(new String(decrypted));
        System.out.println(Base64.encodeBase64String(RSA.encryptByPub("你的咖啡店刷卡".getBytes(StandardCharsets.UTF_8), pub)));
    }
}
