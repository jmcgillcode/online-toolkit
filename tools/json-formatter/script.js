// JSON 格式化工具脚本

// DOM 元素
const inputJson = document.getElementById('inputJson');
const outputJson = document.getElementById('outputJson');
const formatBtn = document.getElementById('formatBtn');
const compressBtn = document.getElementById('compressBtn');
const validateBtn = document.getElementById('validateBtn');
const clearBtn = document.getElementById('clearBtn');
const pasteBtn = document.getElementById('pasteBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const inputStatus = document.getElementById('inputStatus');
const outputStatus = document.getElementById('outputStatus');
const inputStats = document.getElementById('inputStats');
const outputStats = document.getElementById('outputStats');
const indentSize = document.getElementById('indentSize');
const sortKeys = document.getElementById('sortKeys');
const escapeUnicode = document.getElementById('escapeUnicode');

// 示例 JSON 数据
const sampleJson = {
    "name": "JSON格式化工具",
    "version": "1.0.0",
    "description": "一个功能强大的JSON格式化和验证工具",
    "features": [
        "格式化JSON",
        "压缩JSON",
        "验证JSON语法",
        "语法高亮",
        "错误检测"
    ],
    "config": {
        "indentSize": 2,
        "sortKeys": false,
        "escapeUnicode": false
    },
    "stats": {
        "users": 10000,
        "downloads": 50000,
        "rating": 4.8,
        "isActive": true,
        "lastUpdate": "2024-10-16T12:00:00Z"
    },
    "author": {
        "name": "Kit.Sijia.Fun",
        "website": "https://kit.sijia.fun",
        "contact": null
    }
};

// 工具函数
function updateStats(element, text) {
    if (!text) {
        element.textContent = '';
        return;
    }

    const lines = text.split('\n').length;
    const chars = text.length;
    const bytes = new Blob([text]).size;

    element.textContent = `${lines} 行 | ${chars} 字符 | ${Utils.formatFileSize(bytes)}`;
}

function setStatus(element, message, type = 'info') {
    element.textContent = message;
    element.className = `status-info ${type}`;
}

function validateJson(jsonString) {
    if (!jsonString.trim()) {
        return { isValid: false, error: '请输入 JSON 数据' };
    }

    try {
        const parsed = JSON.parse(jsonString);
        return { isValid: true, data: parsed };
    } catch (error) {
        return {
            isValid: false,
            error: error.message,
            position: getErrorPosition(error.message)
        };
    }
}

function getErrorPosition(errorMessage) {
    const match = errorMessage.match(/position (\d+)/);
    return match ? parseInt(match[1]) : null;
}

function formatJson(jsonString, options = {}) {
    const validation = validateJson(jsonString);
    if (!validation.isValid) {
        throw new Error(validation.error);
    }

    const indent = options.indent || 2;
    const sortKeysOption = options.sortKeys || false;
    const escapeUnicodeOption = options.escapeUnicode || false;

    let data = validation.data;

    // 排序键
    if (sortKeysOption) {
        data = sortObjectKeys(data);
    }

    let formatted = JSON.stringify(data, null, indent);

    // 转义 Unicode
    if (escapeUnicodeOption) {
        formatted = formatted.replace(/[\u0080-\uFFFF]/g, function(match) {
            return '\\u' + ('0000' + match.charCodeAt(0).toString(16)).substr(-4);
        });
    }

    return formatted;
}

function compressJson(jsonString) {
    const validation = validateJson(jsonString);
    if (!validation.isValid) {
        throw new Error(validation.error);
    }

    return JSON.stringify(validation.data);
}

function sortObjectKeys(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    }

    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
        sorted[key] = sortObjectKeys(obj[key]);
    });

    return sorted;
}

// 事件处理函数
function handleFormat() {
    try {
        const input = inputJson.value;
        if (!input.trim()) {
            setStatus(outputStatus, '请先输入 JSON 数据', 'error');
            return;
        }

        const options = {
            indent: parseInt(indentSize.value),
            sortKeys: sortKeys.checked,
            escapeUnicode: escapeUnicode.checked
        };

        const formatted = formatJson(input, options);
        outputJson.value = formatted;

        setStatus(outputStatus, '格式化成功', 'success');
        updateStats(outputStats, formatted);

        Utils.Notification.success('JSON 格式化完成');
    } catch (error) {
        setStatus(outputStatus, `格式化失败: ${error.message}`, 'error');
        outputJson.value = '';
        updateStats(outputStats, '');
        Utils.Notification.error('格式化失败: ' + error.message);
    }
}

function handleCompress() {
    try {
        const input = inputJson.value;
        if (!input.trim()) {
            setStatus(outputStatus, '请先输入 JSON 数据', 'error');
            return;
        }

        const compressed = compressJson(input);
        outputJson.value = compressed;

        setStatus(outputStatus, '压缩成功', 'success');
        updateStats(outputStats, compressed);

        const originalSize = new Blob([input]).size;
        const compressedSize = new Blob([compressed]).size;
        const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

        Utils.Notification.success(`压缩完成，节省 ${savings}% 空间`);
    } catch (error) {
        setStatus(outputStatus, `压缩失败: ${error.message}`, 'error');
        outputJson.value = '';
        updateStats(outputStats, '');
        Utils.Notification.error('压缩失败: ' + error.message);
    }
}

function handleValidate() {
    const input = inputJson.value;
    if (!input.trim()) {
        setStatus(inputStatus, '请输入 JSON 数据', 'error');
        return;
    }

    const validation = validateJson(input);
    if (validation.isValid) {
        setStatus(inputStatus, 'JSON 格式正确', 'success');
        Utils.Notification.success('JSON 格式验证通过');
    } else {
        setStatus(inputStatus, `JSON 格式错误: ${validation.error}`, 'error');
        Utils.Notification.error('JSON 格式验证失败');
    }
}

function handleClear() {
    if (Utils.confirm('确定要清空所有内容吗？')) {
        inputJson.value = '';
        outputJson.value = '';
        setStatus(inputStatus, '准备就绪');
        setStatus(outputStatus, '等待处理');
        updateStats(inputStats, '');
        updateStats(outputStats, '');
        Utils.Notification.info('内容已清空');
    }
}

async function handlePaste() {
    try {
        const text = await navigator.clipboard.readText();
        inputJson.value = text;
        setStatus(inputStatus, '粘贴成功');
        updateStats(inputStats, text);
        Utils.Notification.success('内容已粘贴');
    } catch (error) {
        Utils.Notification.error('粘贴失败，请手动粘贴内容');
    }
}

function handleCopy() {
    const output = outputJson.value;
    if (!output.trim()) {
        Utils.Notification.warning('没有可复制的内容');
        return;
    }

    Utils.copyToClipboard(output);
}

function handleDownload() {
    const output = outputJson.value;
    if (!output.trim()) {
        Utils.Notification.warning('没有可下载的内容');
        return;
    }

    const timestamp = Utils.formatDate(new Date(), 'YYYY-MM-DD_HH-mm-ss');
    const filename = `formatted_json_${timestamp}.json`;

    Utils.downloadFile(output, filename, 'application/json');
}

function handleLoadSample() {
    const sampleString = JSON.stringify(sampleJson, null, 2);
    inputJson.value = sampleString;
    setStatus(inputStatus, '示例数据已加载');
    updateStats(inputStats, sampleString);
    Utils.Notification.info('示例数据已加载');
}

// 事件监听器
formatBtn.addEventListener('click', handleFormat);
compressBtn.addEventListener('click', handleCompress);
validateBtn.addEventListener('click', handleValidate);
clearBtn.addEventListener('click', handleClear);
pasteBtn.addEventListener('click', handlePaste);
copyBtn.addEventListener('click', handleCopy);
downloadBtn.addEventListener('click', handleDownload);
loadSampleBtn.addEventListener('click', handleLoadSample);

// 输入框变化监听
inputJson.addEventListener('input', Utils.debounce(function() {
    const text = this.value;
    updateStats(inputStats, text);

    if (text.trim()) {
        const validation = validateJson(text);
        if (validation.isValid) {
            setStatus(inputStatus, 'JSON 格式正确', 'success');
        } else {
            setStatus(inputStatus, `格式错误: ${validation.error}`, 'error');
        }
    } else {
        setStatus(inputStatus, '准备就绪');
    }
}, 500));

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                handleFormat();
                break;
            case 'd':
                e.preventDefault();
                handleDownload();
                break;
            case 'k':
                e.preventDefault();
                handleClear();
                break;
        }
    }
});

// 拖拽上传支持
inputJson.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.backgroundColor = 'var(--bg-secondary)';
});

inputJson.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.backgroundColor = '';
});

inputJson.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.backgroundColor = '';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                inputJson.value = e.target.result;
                setStatus(inputStatus, '文件已加载');
                updateStats(inputStats, e.target.result);
                Utils.Notification.success('JSON 文件已加载');
            };
            reader.readAsText(file);
        } else {
            Utils.Notification.warning('请上传 JSON 文件');
        }
    }
});

// 页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    setStatus(inputStatus, '准备就绪');
    setStatus(outputStatus, '等待处理');

    // 显示快捷键提示
    setTimeout(() => {
        Utils.Notification.info('提示：Ctrl+Enter 格式化，Ctrl+D 下载，Ctrl+K 清空');
    }, 2000);
});

console.log('✅ JSON 格式化工具已加载');