import { Html, Button, Text } from '@react-email/components';


const OtpEmail = ({ username, code }: { username: string, code: String }) => {
    return (
        <Html lang="en" dir="ltr">
            <Text>Hello {username}!</Text>
            <p>This is your one time OTP {code}. Do not share with this anyone</p>
            <Button href="https://example.com" style={{ color: "#61dafb" }}>
                review us
            </Button>
        </Html>
    );
};


export default OtpEmail;
