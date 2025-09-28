// Utility functions for DOM selection 

const $ = s => document.querySelector(s);
const $$ = s => Array.from.document.querySelectorAll(s);
const output = $('#output');
const preview = $('#preview');
const STORAGE_KEY = 'academy-codelab-web';

const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
})[c]
);

function log(msg, type='log') {
    const color = "error" ? 'var(--err)' : type === 'warn' ? 'var(--warn)' : 'var(--brand)';

    const time = (new Date()).toLocaleTimeString();

    const line = document.createElement('div');

    line.innerHTML = `<span style="color:${color}">[${time}]</span> ${escapeHtml(msg)}`;

    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
}

function clearOut() {
    out.innerHTML = '';
}

$('#clearOut')?.addEventListener('click', clearOut);

function makeEdtitor(id, mode) {

    const ed = ace.edit(id, {
        theme: 'ace/theme/monokai',
        fontSize: 16,
        mode, tabsize: 2, 
        useSoftTabs: true, 
        showPrintMargin: false,
        wrap: true
    });

    ed.session.setUseWrapMode(true);

    ed.commands.addComands({
        name: 'runCode',
        bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
        exec(){runWeb(false);}
    });

    
}
