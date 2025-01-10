import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login, getCaptcha } from "@/api";

import useTokenStore from "@/stores/token";
import useUserStore from "@/stores/user";
import { shallow } from "zustand/shallow";

import { useLoadPermissionData } from "@/hooks/useLoadPermissionData";
import { useEffect, useState } from "react";

const Login = () => {
  const [uuid, setUuid] = useState();

  const [captchaImg, setCaptchaImg] = useState();
  const getCaptchaData = async () => {
    const res = await getCaptcha();
    if (res.code === 200) {
      // const img = (document.createElement("svg").innerHTML = res.data.img);
      setUuid(res.data.uuid);
      setCaptchaImg(res.data.img);
    }
  };

  useEffect(() => {
    getCaptchaData();
  }, []);

  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken, shallow);
  const [user, setUser] = useUserStore(
    (state) => [state.user, state.setUser],
    shallow
  );
  const getPermissionData = useLoadPermissionData();

  const onFinish = async (values) => {
    const { username, password, captcha, remember } = values;
    const res = await login({ username, password, captcha, uuid });
    if (res?.code === 200) {
      setToken(res.data.token);
      if (remember) {
        setUser({
          ...res.data.userInfo,
          name: res.data.userInfo.nickname,
          ...values,
        });
      } else {
        setUser({
          ...res.data.userInfo,
          name: res.data.userInfo.nickname,
          username: "",
          password: "",
          remember,
        });
      }

      // 加载用户权限
      await getPermissionData();

      navigate("/");
    }
  };

  return (
    <div className="absolute w-[300px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <Form
        initialValues={{
          remember: user.remember,
          username: user.username,
          password: user.password,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            size="large"
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input
            prefix={<LockOutlined />}
            size="large"
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="captcha"
          rules={[{ required: true, message: "请输入验证码!" }]}
        >
          <Input
            addonAfter={
              <div
                dangerouslySetInnerHTML={{ __html: captchaImg }}
                onClick={getCaptchaData}
              ></div>
            }
            size="large"
            placeholder="请输入验证码"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <div>账号: admin 密码: 123456</div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
