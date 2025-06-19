import React, { useState } from 'react';
import { Modal, Typography, Button, Space, Card, Row, Col } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    LoginOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

interface DemoWelcomeModalProps {
    visible: boolean;
    onClose: () => void;
    onLogin?: (credentials: { email: string; password: string }) => void;
}

export const DemoWelcomeModal: React.FC<DemoWelcomeModalProps> = ({ visible, onClose, onLogin }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const demoCredentials = {
        email: "a@a",
        password: "1"
    };

    const steps = [
        {
            title: "ברוכים הבאים למערכת BusinessMan! 🎉",
            subtitle: "הדגמה מיוחדת עבורך",
            content: (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <HomeOutlined
                            style={{
                                fontSize: '80px',
                                color: '#667eea',
                                marginBottom: '20px',
                                display: 'block'
                            }}
                        />
                    </motion.div>
                    <Paragraph style={{ fontSize: '16px', lineHeight: 1.6 }}>
                        שלום! כדי להתרשם מהאפליקציה שלנו, אתה מוזמן להיכנס עם הנתונים הבאים שיצרנו במיוחד בשבילך:
                    </Paragraph>
                </div>
            )
        },
        {
            title: "פרטי הכניסה להדגמה 🔑",
            subtitle: "השתמש בנתונים האלה כדי להיכנס",
            content: (
                <div style={{ padding: '20px' }}>
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                            border: '2px solid #667eea',
                            borderRadius: '16px'
                        }}
                    >
                        <Row gutter={[16, 16]} align="middle">
                            <Col span={24}>
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Space align="center" style={{ width: '100%', justifyContent: 'flex-start' }}>
                                        <UserOutlined style={{ fontSize: '20px', color: '#667eea' }} />
                                        <div>
                                            <Text strong>אימייל:</Text>
                                            <br />
                                            <Text
                                                copyable={{
                                                    text: demoCredentials.email,
                                                    tooltips: ['העתק', 'הועתק!']
                                                }}
                                                style={{
                                                    fontSize: '16px',
                                                    color: '#667eea',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'monospace'
                                                }}
                                            >
                                                {demoCredentials.email}
                                            </Text>
                                        </div>
                                    </Space>
                                </motion.div>
                            </Col>

                            <Col span={24}>
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Space align="center" style={{ width: '100%', justifyContent: 'flex-start' }}>
                                        <LockOutlined style={{ fontSize: '20px', color: '#667eea' }} />
                                        <div>
                                            <Text strong>סיסמא:</Text>
                                            <br />
                                            <Text
                                                copyable={{
                                                    text: demoCredentials.password,
                                                    tooltips: ['העתק', 'הועתק!']
                                                }}
                                                style={{
                                                    fontSize: '16px',
                                                    color: '#667eea',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'monospace'
                                                }}
                                            >
                                                {demoCredentials.password}
                                            </Text>
                                        </div>
                                    </Space>
                                </motion.div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            )
        },
        {
            title: "מוכנים להתחיל! 🚀",
            subtitle: "אנחנו כאן בשבילך",
            content: (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <InfoCircleOutlined
                            style={{
                                fontSize: '60px',
                                color: '#52c41a',
                                marginBottom: '20px',
                                display: 'block'
                            }}
                        />
                    </motion.div>
                    <Paragraph style={{ fontSize: '16px', lineHeight: 1.6 }}>
                        אם תרצה עזרה נוספת או יש לך שאלות, אנחנו כאן בשבילך!
                        <br />
                        <strong>בהצלחה ובהנאה מהשימוש באפליקציה! 🎯</strong>
                    </Paragraph>
                </div>
            )
        }
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleLogin = () => {
        if (onLogin) {
            onLogin(demoCredentials);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {visible && (
                <Modal
                    open={visible}
                    onCancel={onClose}
                    footer={null}
                    width={600}
                    centered
                    closeIcon={null}
                    styles={{
                        mask: {
                            backdropFilter: 'blur(8px)',
                            background: 'rgba(0, 0, 0, 0.7)'
                        }
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        {/* Header with progress */}
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '30px 30px 20px 30px',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Animated background particles */}
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        width: '6px',
                                        height: '6px',
                                        background: 'rgba(255,255,255,0.3)',
                                        borderRadius: '50%',
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        y: [-10, 10],
                                        opacity: [0.3, 0.8],
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: Math.random() * 2,
                                    }}
                                />
                            ))}

                            <motion.div
                                key={currentStep}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                style={{ position: 'relative', zIndex: 1 }}
                            >
                                <Title
                                    level={3}
                                    style={{
                                        color: 'white',
                                        margin: 0,
                                        textAlign: 'center',
                                        fontSize: '24px'
                                    }}
                                >
                                    {steps[currentStep].title}
                                </Title>
                                <Text
                                    style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        display: 'block',
                                        textAlign: 'center',
                                        marginTop: '8px',
                                        fontSize: '16px'
                                    }}
                                >
                                    {steps[currentStep].subtitle}
                                </Text>
                            </motion.div>

                            {/* Progress bar */}
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    height: '4px',
                                    background: 'rgba(255,255,255,0.3)',
                                    width: '100%'
                                }}
                            >
                                <motion.div
                                    style={{
                                        height: '100%',
                                        background: 'rgba(255,255,255,0.9)',
                                    }}
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div style={{ minHeight: '200px' }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {steps[currentStep].content}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '20px 30px 30px 30px',
                            borderTop: '1px solid #f0f0f0'
                        }}>
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Text type="secondary">
                                        {currentStep + 1} מתוך {steps.length}
                                    </Text>
                                </Col>
                                <Col>
                                    <Space>
                                        {currentStep > 0 && (
                                            <Button
                                                onClick={prevStep}
                                                style={{ borderRadius: '8px' }}
                                            >
                                                חזור
                                            </Button>
                                        )}

                                        {currentStep < steps.length - 1 ? (
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button
                                                    type="primary"
                                                    onClick={nextStep}
                                                    icon={<ArrowRightOutlined />}
                                                    style={{
                                                        borderRadius: '8px',
                                                        background: '#667eea',
                                                        borderColor: '#667eea'
                                                    }}
                                                >
                                                    המשך
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <Space>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Button
                                                        type="primary"
                                                        onClick={handleLogin}
                                                        icon={<LoginOutlined />}
                                                        size="large"
                                                        style={{
                                                            borderRadius: '8px',
                                                            background: '#52c41a',
                                                            borderColor: '#52c41a',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        כניסה להדגמה
                                                    </Button>
                                                </motion.div>
                                                <Button
                                                    onClick={onClose}
                                                    style={{ borderRadius: '8px' }}
                                                >
                                                    סגור
                                                </Button>
                                            </Space>
                                        )}
                                    </Space>
                                </Col>
                            </Row>
                        </div>
                    </motion.div>
                </Modal>
            )}
        </AnimatePresence>
    );
};