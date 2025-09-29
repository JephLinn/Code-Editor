// Utility functions for DOM selection 
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const output = $('#output');
const preview = $('#preview');
const STORAGE_KEY = 'web-code-editor-project';

const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
})[c]
);

function log(msg, type='log') {
    const color = type === "error" ? 'var(--err)' : type === 'warn' ? 'var(--warn)' : 'var(--brand)';

    const time = (new Date()).toLocaleTimeString();

    const line = document.createElement('div');

    line.innerHTML = `<span style="color:${color}">[${time}]</span> ${escapeHtml(msg)}`;

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function clearOut() {
    output.innerHTML = '';
}

$('#clearOut')?.addEventListener('click', clearOut);

function makeEditor(id, mode) {

    const ed = ace.edit(id, {
        theme: 'ace/theme/monokai',
        fontSize: 16,
        mode, tabsize: 2, 
        useSoftTabs: true, 
        showPrintMargin: false,
        wrap: true
    });

    ed.session.setUseWrapMode(true);

    ed.commands.addCommand({
        name: 'runCode',
        bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
        exec(){runWeb(false);}
    });

    ed.commands.addCommand({
        name: 'save',
        bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
        exec(){saveProject();}
})

    return ed;
}

const ed_html = makeEditor('ed_html', 'ace/mode/html');
const ed_css = makeEditor('ed_css', 'ace/mode/css');
const ed_js = makeEditor('ed_js', 'ace/mode/javascript');

const TAB_ORDER = ['html', 'css', 'js'];

const wraps = Object.fromEntries($$("#webEditors .editor-wrap").map(w => [w.dataset.pane, w]));

const editors = {
    html: ed_html,
    css: ed_css,
    js: ed_js
};

function activePane() {
    const t = $('#webEditors .tabs .tab.active');
    return t ? t.dataset.pane  : 'html';
}

function showPane(name) {
    TAB_ORDER.forEach (k => {
        if (wraps[k]) {
            wraps[k].hidden = (k !== name);
        }})

        $$("#webTabs .tab").forEach(t => {
            const on = t.dataset.pane === name;
            t.classList.toggle('active', on);
            t.setAttribute('aria-selected', on);
            t.tabIndex = on ? 0 : -1;
        }); 

        requestAnimationFrame(() => {
            const ed = editors[name];
            if (ed && ed.resize) {
                ed.resize(true);
                ed.focus();
            };
});
}

$("#webTabs").addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (!btn) {
        return;
    }
    showPane(btn.dataset.pane);
})

$("#webTabs")?.addEventListener('keydown', e => {
    const idx = TAB_ORDER.indexOf(activePane());
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const delta = e.key === 'ArrowLeft' ? -1 : 1;
        showPane(TAB_ORDER[(idx + delta + TAB_ORDER.length) % TAB_ORDER.length]);
        e.preventDefault();
    }
})

showPane('html');

function buildwebSRCdoc(wthTests=false) {
    const html = ed_html.getValue();
    const css = ed_css.getValue();
    const js = ed_js.getValue();
    const tests = ($("#testarea")?.value || '').trim();
    
    return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Preview</title>
        <style>
        ${css}\n
        </style>
    </head>

    <body>
        ${html}
        <script>
        try {
            ${js}
            
            ${wthTests && tests ? `\n/* test /\n ${tests} \n/* end test */` : ''}
        } catch (e) {
            console.error('Error during tests:', e);
        }
        <\/script>
        
    </body>
    </html>
    `;

}

function runWeb(wthTests=false) {
    const srcdoc = buildwebSRCdoc(wthTests);
    preview.srcdoc = srcdoc;
    log(wthTests ? 'Run with tests' : 'Web preview updated.');
}

$('#runWeb')?.addEventListener('click', () => runWeb(false));
$('#runTests')?.addEventListener('click', () => runWeb(true));

$("#openPreview")?.addEventListener('click', () => {
    const src = buildwebSRCdoc(true);
    const w = window.open("about:blank")

    w.document.open()
    w.document.write(src);
    w.document.close();
});

function projectJSON() {
    return {
        version: 1,
        kind: 'web-only',
        assignment: $('assignment')?.value || "",
        test: $('#testarea')?.value || "",
        html: ed_html.getValue(),
        css: ed_css.getValue(),
        js: ed_js.getValue()
    };
}

function loadProject(obj) {
    try {
        if ($('#assignment')) {
            $('#assignment').value = obj.assignment || "";
        }

        if ($('#testarea')) {
            $('#testarea').value = obj.test || "";
        }

        ed_html.setValue(obj.html || "", -1);
        ed_css.setValue(obj.css || "", -1);
        ed_js.setValue(obj.js || "", -1);

        log('Web Project loaded.');
    } catch (e) {
        log('Error loading project: ' + e, 'error');
    }
}

function setDefaultContent() {
    ed_html.setValue(`<!-- Start your HTML here -->\n`, -1);
    ed_css.setValue(`/* Start your CSS here */\nbody {\n  font-family: sans-serif;\n}\n`, -1);
    ed_js.setValue(`// Start your JavaScript here\nconsole.log('Hello, world!');\n`, -1);
}

function saveProject() {
    try{
        const obj = JSON.stringify(projectJSON(), null, 2);
    localStorage.setItem(STORAGE_KEY, obj);
    const blob = new Blob([obj], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'web-project.json';
    a.click();
    log('Project saved locally and downloaded JSON file.');
    } catch (e) {
        log('Error saving project: ' + e, 'error');
    }
}

$('#saveBtn')?.addEventListener('click', saveProject);

$('#loadBtn')?.addEventListener('click', () => $('#openFile').click());
$('#openFile')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
        return;
    }
    try {
        const text = await file.text();
        const obj = JSON.parse(text);
        loadProject(obj);
    } catch (e) {
        log('Invalid project file', 'error');
    }
})
  
try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const obj = JSON.parse(saved);
        loadProject(obj);
    } else {
        setDefaultContent();
    } } catch (e) {
        setDefaultContent(); 
}

log('Editor ready. HTML, CSS, JS editors initialized.');