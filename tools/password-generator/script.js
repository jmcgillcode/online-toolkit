// 密码生成器脚本

// 字符集定义
const CHARSET = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    ambiguous: '0oO1lI'
};

// DOM 元素
const passwordOutput = document.getElementById('passwordOutput');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const strengthIndicator = document.getElementById('strengthIndicator');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const includeUppercase = document.getElementById('includeUppercase');
const includeLowercase = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');
const excludeAmbiguous = document.getElementById('excludeAmbiguous');
const startWithLetter = document.getElementById('startWithLetter');
const batchCount = document.getElementById('batchCount');
const batchGenerateBtn = document.getElementById('batchGenerateBtn');
const batchResults = document.getElementById('batchResults');

// 生成密码函数
function generatePassword(options) {
    const {
        length = 16,
        includeUpper = true,
        includeLower = true,
        includeNum = true,
        includeSymbol = false,
        excludeAmb = false,
        startLetter = false
    } = options;

    let charset = '';
    let requiredChars = '';

    // 构建字符集
    if (includeUpper) {
        charset += CHARSET.uppercase;
        requiredChars += getRandomChar(CHARSET.uppercase);
    }
    if (includeLower) {
        charset += CHARSET.lowercase;
        requiredChars += getRandomChar(CHARSET.lowercase);
    }
    if (includeNum) {
        charset += CHARSET.numbers;
        requiredChars += getRandomChar(CHARSET.numbers);
    }
    if (includeSymbol) {
        charset += CHARSET.symbols;
        requiredChars += getRandomChar(CHARSET.symbols);
    }

    if (!charset) {
        throw new Error('至少选择一种字符类型');
    }

    // 排除易混淆字符
    if (excludeAmb) {
        charset = charset.split('').filter(char => !CHARSET.ambiguous.includes(char)).join('');
    }

    // 生成密码
    let password = '';

    // 如果要求以字母开头
    if (startLetter) {
        const letters = CHARSET.uppercase + CHARSET.lowercase;
        const availableLetters = excludeAmb ?
            letters.split('').filter(char => !CHARSET.ambiguous.includes(char)).join('') :
            letters;
        password += getRandomChar(availableLetters);
    }

    // 确保包含所有要求的字符类型
    for (let char of requiredChars) {
        if (password.length < length) {
            password += char;
        }
    }

    // 填充剩余长度
    while (password.length < length) {
        password += getRandomChar(charset);
    }

    // 打乱字符顺序（除了第一个字符，如果要求以字母开头）
    const startIndex = startLetter ? 1 : 0;
    const shufflePart = password.slice(startIndex).split('').sort(() => Math.random() - 0.5).join('');
    password = password.slice(0, startIndex) + shufflePart;

    return password;
}

function getRandomChar(charset) {
    return charset[Math.floor(Math.random() * charset.length)];
}

// 密码强度评估
function assessPasswordStrength(password) {
    let score = 0;
    const length = password.length;

    // 长度评分
    if (length >= 12) score += 25;
    else if (length >= 8) score += 15;
    else if (length >= 6) score += 10;

    // 字符类型评分
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 20;

    // 复杂度评分
    const uniqueChars = new Set(password).size;
    score += Math.min(uniqueChars * 2, 10);

    if (score >= 80) return { level: 'strong', text: '强密码', class: 'strength-strong' };
    if (score >= 50) return { level: 'medium', text: '中等强度', class: 'strength-medium' };
    return { level: 'weak', text: '弱密码', class: 'strength-weak' };
}

// 更新强度指示器
function updateStrengthIndicator(password) {
    if (!password) {
        strengthIndicator.textContent = '';
        strengthIndicator.className = 'strength-indicator';
        return;
    }

    const strength = assessPasswordStrength(password);
    strengthIndicator.textContent = strength.text;
    strengthIndicator.className = `strength-indicator ${strength.class}`;
}

// 获取当前设置
function getCurrentOptions() {
    return {
        length: parseInt(lengthSlider.value),
        includeUpper: includeUppercase.checked,
        includeLower: includeLowercase.checked,
        includeNum: includeNumbers.checked,
        includeSymbol: includeSymbols.checked,
        excludeAmb: excludeAmbiguous.checked,
        startLetter: startWithLetter.checked
    };
}

// 事件处理函数
function handleGenerate() {
    try {
        const options = getCurrentOptions();
        const password = generatePassword(options);
        passwordOutput.value = password;
        updateStrengthIndicator(password);
        Utils.Notification.success('密码生成成功');
    } catch (error) {
        Utils.Notification.error(error.message);
    }
}

function handleCopy() {
    const password = passwordOutput.value;
    if (!password) {
        Utils.Notification.warning('请先生成密码');
        return;
    }
    Utils.copyToClipboard(password);
}

function handleBatchGenerate() {
    const count = parseInt(batchCount.value);
    if (count < 1 || count > 50) {
        Utils.Notification.error('批量生成数量应在1-50之间');
        return;
    }

    try {
        const options = getCurrentOptions();
        const passwords = [];

        for (let i = 0; i < count; i++) {
            passwords.push(generatePassword(options));
        }

        displayBatchResults(passwords);
        Utils.Notification.success(`成功生成 ${count} 个密码`);
    } catch (error) {
        Utils.Notification.error(error.message);
    }
}

function displayBatchResults(passwords) {
    batchResults.innerHTML = '';
    passwords.forEach((password, index) => {
        const item = document.createElement('div');
        item.className = 'batch-item';
        item.innerHTML = `
            <span>${index + 1}.</span>
            <input type="text" value="${password}" readonly>
            <button class="btn-small" onclick="Utils.copyToClipboard('${password}')">复制</button>
        `;
        batchResults.appendChild(item);
    });
}

// 事件监听器
generateBtn.addEventListener('click', handleGenerate);
regenerateBtn.addEventListener('click', handleGenerate);
copyBtn.addEventListener('click', handleCopy);
batchGenerateBtn.addEventListener('click', handleBatchGenerate);

// 长度滑块
lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
});

// 字符类型变化时自动生成新密码
[includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous, startWithLetter].forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (passwordOutput.value) {
            handleGenerate();
        }
    });
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                handleGenerate();
                break;
            case 'c':
                if (document.activeElement === passwordOutput) {
                    e.preventDefault();
                    handleCopy();
                }
                break;
        }
    }

    if (e.key === 'F5') {
        e.preventDefault();
        handleGenerate();
    }
});

// 页面加载时生成初始密码
document.addEventListener('DOMContentLoaded', function() {
    handleGenerate();

    // 显示快捷键提示
    setTimeout(() => {
        Utils.Notification.info('提示：Ctrl+Enter 生成新密码，F5 重新生成');
    }, 2000);
});

console.log('✅ 密码生成器已加载');