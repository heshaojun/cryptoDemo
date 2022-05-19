package info.cheerfish.controller;

import com.alibaba.fastjson.JSONObject;
import info.cheerfish.controller.bo.ReqEncryptBo;
import info.cheerfish.controller.vo.TestVo;
import info.cheerfish.rest.RestResp;
import info.cheerfish.rest.http.Adaptor;
import info.cheerfish.rest.http.Adaptors;
import info.cheerfish.rest.http.adaptor.*;
import info.cheerfish.rest.http.session.RestSession;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("test")
@Log4j2
public class TestController {
    @RequestMapping("beforeLoginTest")
    @Adaptors({
            @Adaptor(desc = "test", adaptor = ApiQpsAdaptor.class, params = "testApiQps"),
            @Adaptor(adaptor = ChangeServerKeyAdaptor.class)
    })
    public RestResp<String> beforeLoginTest() {
        log.info("beforeLoginTest---------------------------");
        return RestResp.ok("hello world,的首发式地方");
    }

    @RequestMapping("loginRequiredTest")
    @Adaptors({
    })
    public RestResp<String> loginRequiredTest() {
        return RestResp.ok("ok");
    }

    @RequestMapping("reqEncryptTest")
    @Adaptors({
            @Adaptor(desc = "test", adaptor = ApiQpsAdaptor.class, params = "testApiQps"),
    })
    public RestResp<String> reqEncryptTest(ReqEncryptBo reqEncryptBo) {
        log.info("-----" + JSONObject.toJSONString(reqEncryptBo));
        return RestResp.ok("ok");
    }

    @RequestMapping("loginEntryTest")
    @Adaptors({
            @Adaptor(desc = "test", adaptor = ApiQpsAdaptor.class, params = "testApiQps"),
            @Adaptor(adaptor = LoginEntryAdaptor.class)
    })
    public RestResp<String> loginEntryTest(ReqEncryptBo reqEncryptBo) {
        log.info("-----" + JSONObject.toJSONString(reqEncryptBo));
        RestSession.setThreadVariable("userId", reqEncryptBo.getUserName());
        return RestResp.ok("ok");
    }

    @RequestMapping("logoutEntryTest")
    @Adaptors({
            @Adaptor(desc = "test", adaptor = ApiQpsAdaptor.class, params = "testApiQps"),
            @Adaptor(adaptor = LogoutEntryAdaptor.class)
    })
    public RestResp<String> logoutEntryTest(ReqEncryptBo reqEncryptBo) {
        log.info("-----" + JSONObject.toJSONString(reqEncryptBo));
        RestSession.setThreadVariable("userId", reqEncryptBo.getUserName());
        return RestResp.ok("ok");
    }

    @RequestMapping("respEncryptedTest")
    @Adaptors({
            @Adaptor(adaptor = RespDataEncryptAdaptor.class)
    })
    public RestResp<TestVo> respEncryptedTest() {
        return RestResp.ok(new TestVo("hehehe", "superman"));
    }

    @RequestMapping("replayDefenseTest")
    @Adaptors({
            @Adaptor(adaptor = RespDataEncryptAdaptor.class),
            @Adaptor(adaptor = ReplayAttackDefenseAdaptor.class, params = "replayDefenseTest")
    })
    public RestResp<TestVo> replayDefenseTest() {
        return RestResp.ok(new TestVo("hehehe", "superman"));
    }
}
