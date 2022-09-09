import { PageLayout, Form, Button } from "@ahaui/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import useCrossDomainCredentials from "../useCrossDomainCredentials";

const Home = () => {
  const { register, handleSubmit } = useForm();
  const [credentials, setCredentials] = useState(null);
  const handleLogout = useCallback(() => {
    console.log("logout");
  }, []);
  const onLoginSuccess = useCallback((data: any) => {
    console.log("login");
    setCredentials(data);
  }, []);
  const { setNewCredentials, removeCredentials } = useCrossDomainCredentials({
    iframeUrl: "https://cross-domain-credentials.vercel.app",
    handleLogout,
    onReadyCredentials: onLoginSuccess,
  });
  const onSubmit = async (data: any) => {
    if (typeof window !== "undefined") {
      await setNewCredentials({
        ...data,
        type: "email",
      });
    }
  };
  const onRemove = async () => {
    await removeCredentials();
  };

  return (
    <PageLayout>
      <PageLayout.Body className="u-backgroundLightest">
        <div className="Container">
          {credentials ? credentials?.email : "no credentials"}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="exampleForm.email">
              <Form.Label>Email</Form.Label>
              <Form.Input type="text" {...register("email")} />
            </Form.Group>
            <Form.Group controlId="exampleForm.password">
              <Form.Label>Password</Form.Label>
              <Form.Input type="password" {...register("password")} />
            </Form.Group>

            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Submit
            </Button>
          </Form>
          <Button onClick={() => window && window.location.reload()}>
            Reload
          </Button>
          <Button variant="negative" onClick={() => onRemove()}>
            Logout
          </Button>
          <Button
            onClick={() => {
              window && window.location.replace("https://hh-tinhvqbk.vercel.app");
            }}
          >
            Go to HB Portal
          </Button>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default Home;
