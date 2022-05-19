package info.cheerfish.controller.vo;

import lombok.Data;

/**
 * @author Masker                    -
 * @description TODO entry class function .....
 * @date 2022/5/19 09:19
 */

@Data
public class TestVo {
    private String userName;
    private String sex;

    public TestVo(String userName, String sex) {
        this.userName = userName;
        this.sex = sex;
    }
}
