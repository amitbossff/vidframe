@import 'tailwindcss';

:root{
--bg-1:#f0f4ff;--bg-2:#e0e7ff;--bg-3:#dbeafe;
--surface:#ffffff;--surface-2:#f8fafc;
--border:#e2e8f0;--border-hover:#cbd5e1;
--text:#1e1b4b;--text-2:#64748b;--text-3:#94a3b8;
--accent:#6366f1;--accent-2:#8b5cf6;
--success:#10b981;--success-dark:#059669;--success-soft:rgba(16,185,129,.08);
--danger:#ef4444;--amber:#f59e0b;--cyan:#06b6d4;
--shadow-sm:0 1px 3px rgba(15,23,42,.08);
--shadow-md:0 4px 12px rgba(15,23,42,.08);
--shadow-lg:0 12px 32px rgba(15,23,42,.12);
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;padding:0;background:var(--bg-1);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.5}
.app-shell{min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:16px;position:relative;overflow:hidden;background:radial-gradient(circle at 15% 15%,rgba(99,102,241,.15),transparent 45%),radial-gradient(circle at 85% 20%,rgba(139,92,246,.12),transparent 45%),radial-gradient(circle at 75% 85%,rgba(6,182,212,.10),transparent 50%),linear-gradient(135deg,#f0f4ff 0%,#e0e7ff 50%,#dbeafe 100%);background-attachment:fixed}
.ambient{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;animation:float 20s ease-in-out infinite;opacity:.6}
.ambient-one{width:340px;height:340px;background:rgba(99,102,241,.25);top:-120px;right:-100px;animation-delay:0s}
.ambient-two{width:280px;height:280px;background:rgba(139,92,246,.20);bottom:-100px;left:-80px;animation-delay:-7s}
.ambient-three{width:240px;height:240px;background:rgba(6,182,212,.18);top:40%;right:-120px;animation-delay:-14s}
@keyframes float{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.1)}66%{transform:translate(-20px,30px) scale(.95)}}
.card{position:relative;z-index:1;width:100%;max-width:400px;background:var(--surface);border:1px solid var(--border);border-radius:24px;box-shadow:var(--shadow-lg);overflow:hidden}

/* ============ HOME CARD ============ */
.home-card{max-width:420px;max-height:calc(100dvh - 32px);display:flex;flex-direction:column;overflow:hidden;padding:0}
.home-header{padding:18px 20px 12px;border-bottom:1px solid var(--border)}
.home-title{margin:0 0 2px;font-size:19px;font-weight:800;letter-spacing:-.4px;color:var(--text)}
.home-sub{margin:0;font-size:11.5px;color:var(--text-3);font-weight:500}
.number-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:12px 16px 8px;padding:10px 12px;background:linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.05));border:1px solid rgba(99,102,241,.20);border-radius:12px}
.number-bar-left{display:flex;align-items:center;gap:10px;min-width:0}
.number-bar-left svg{color:var(--accent);flex-shrink:0}
.number-bar-label{font-size:10px;color:var(--text-3);font-weight:600;letter-spacing:.4px;text-transform:uppercase;margin-bottom:1px}
.number-bar-value{font-size:13.5px;color:var(--text);font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:.5px}
.number-edit-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:20px;font-size:11.5px;font-weight:700;font-family:inherit;cursor:pointer;transition:all .15s;box-shadow:0 4px 12px rgba(99,102,241,.30);flex-shrink:0}
.number-edit-btn:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(99,102,241,.40)}
.view-submitted-btn{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 16px 12px;padding:11px 14px;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.18);border-radius:11px;color:var(--accent);font-size:12.5px;font-weight:600;text-decoration:none;transition:all .15s}
.view-submitted-btn:hover{background:rgba(99,102,241,.12);border-color:rgba(99,102,241,.35);transform:translateY(-1px)}

/* ============ TASK LIST ============ */
.task-list{flex:1;overflow-y:auto;padding:4px 16px 16px;display:flex;flex-direction:column;gap:10px}
.task-list::-webkit-scrollbar{width:5px}
.task-list::-webkit-scrollbar-thumb{background:rgba(99,102,241,.20);border-radius:3px}
.task-list-item{display:flex;gap:10px;padding:10px;background:var(--surface-2);border:1px solid var(--border);border-radius:14px;text-decoration:none;color:inherit;transition:all .18s}
.task-list-item:hover{border-color:rgba(99,102,241,.40);background:rgba(99,102,241,.04);transform:translateY(-1px);box-shadow:var(--shadow-md)}
.task-list-thumb-wrap{position:relative;width:100px;height:70px;border-radius:10px;overflow:hidden;background:#000;flex-shrink:0;border:1px solid var(--border)}
.task-list-thumb{width:100%;height:100%;object-fit:cover;display:block}
.task-list-badge{position:absolute;bottom:4px;left:4px;padding:2px 7px;border-radius:10px;font-size:8.5px;font-weight:800;color:#fff;letter-spacing:.3px;text-transform:uppercase}
.task-list-badge.watch-full{background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 2px 6px rgba(239,68,68,.35)}
.task-list-badge.watch-minutes{background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 2px 6px rgba(245,158,11,.35)}
.task-list-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.task-list-top{display:flex;align-items:center;justify-content:space-between;gap:6px}
.task-list-bot{display:inline-block;padding:2px 7px;background:rgba(99,102,241,.12);color:var(--accent);border-radius:5px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px}
.task-list-slots{font-size:10.5px;color:var(--text-2);font-weight:700;font-variant-numeric:tabular-nums;display:inline-flex;align-items:center;gap:4px}
.task-list-slots strong{color:var(--text);font-weight:800}
.task-list-dot{color:var(--text-3);font-weight:700}
.task-list-amount{color:var(--success-dark);font-weight:800;background:linear-gradient(135deg,rgba(16,185,129,.12),rgba(5,150,105,.06));padding:1px 7px;border-radius:6px;font-size:10px;border:1px solid rgba(16,185,129,.20)}
.task-list-title{margin:0;font-size:11.5px;font-weight:700;color:var(--text);line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.task-list-channel{margin:0;font-size:10px;color:#0891b2;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.task-list-bar{height:4px;background:rgba(99,102,241,.10);border-radius:2px;overflow:hidden;margin-top:2px}
.task-list-fill{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4);border-radius:2px;transition:width .4s}
.task-list-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:2px}
.task-list-remaining{font-size:9.5px;color:var(--text-3);font-weight:600}
.task-list-open{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:var(--accent);font-weight:800;letter-spacing:.3px}
.task-list-open svg{width:10px;height:10px}

/* ============ WELCOME ============ */
.welcome{padding:40px 28px 32px;display:flex;flex-direction:column;gap:20px}
.welcome h1{margin:0;font-size:26px;font-weight:700;letter-spacing:-.5px;line-height:1.2;color:var(--text)}
.welcome-sub{margin:-12px 0 0;color:var(--text-2);font-size:14px;line-height:1.5}
.welcome-form{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.welcome-form label{font-size:12px;font-weight:600;color:var(--text-2);letter-spacing:.3px}
.input{width:100%;height:52px;padding:0 16px;background:var(--surface-2);border:1.5px solid var(--border);border-radius:14px;color:var(--text);font-size:16px;font-weight:600;letter-spacing:1px;outline:none;transition:all .2s;font-family:inherit;text-align:center}
.input::placeholder{color:var(--text-3);font-weight:400;letter-spacing:0}
.input:focus{border-color:var(--accent);background:rgba(99,102,241,.04);box-shadow:0 0 0 4px rgba(99,102,241,.10)}

/* ============ BUTTONS ============ */
.btn-primary{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:52px;padding:0 20px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);color:#fff;border:none;border-radius:14px;font-size:15px;font-weight:700;letter-spacing:.2px;cursor:pointer;transition:all .2s;font-family:inherit;box-shadow:0 8px 24px rgba(99,102,241,.30);position:relative;overflow:hidden}
.btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,#7c7ff5 0%,#9d6fff 100%);opacity:0;transition:opacity .2s}
.btn-primary:hover:not(:disabled)::before{opacity:1}
.btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(99,102,241,.40)}
.btn-primary:disabled{opacity:.5;cursor:not-allowed}
.btn-primary>*{position:relative;z-index:1}
.btn-primary.ready{background:linear-gradient(135deg,#10b981 0%,#059669 100%);box-shadow:0 8px 24px rgba(16,185,129,.30)}
.btn-primary.ready:hover:not(:disabled){box-shadow:0 12px 32px rgba(16,185,129,.40)}
.btn-ghost{height:52px;padding:0 20px;background:var(--surface-2);color:var(--text-2);border:1.5px solid var(--border);border-radius:14px;font-size:14px;font-weight:600;cursor:pointer;transition:all .15s;font-family:inherit}
.btn-ghost:hover{background:#f1f5f9;color:var(--text);border-color:var(--border-hover)}
.icon-btn{width:38px;height:38px;display:flex;align-items:center;justify-content:center;background:var(--surface-2);border:1.5px solid var(--border);border-radius:11px;color:var(--text-2);cursor:pointer;transition:all .15s;flex-shrink:0}
.icon-btn:hover{color:var(--text);border-color:var(--border-hover);background:#f1f5f9}
.error{font-size:12px;color:#dc2626;margin-top:2px;font-weight:500}

/* ============ BOT HEADER (Arrow + Watch + Amount in 1 line) ============ */
.bot-header-bar{display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--surface);border-bottom:1px solid var(--border);position:relative;z-index:2}
.bot-back-btn{width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:var(--surface-2);border:1.5px solid var(--border);border-radius:50%;color:var(--text);cursor:pointer;flex-shrink:0;transition:all .15s;text-decoration:none}
.bot-back-btn:hover{background:rgba(99,102,241,.10);border-color:var(--accent);color:var(--accent)}
.bot-back-btn:active{transform:scale(.92)}
.bot-back-btn svg{width:16px;height:16px}
.bot-header-watch{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 12px;border-radius:11px;font-size:10.5px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:#fff;min-width:0}
.bot-header-watch.watch-full{background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 4px 12px rgba(239,68,68,.30)}
.bot-header-watch.watch-minutes{background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 4px 12px rgba(245,158,11,.30)}
.bot-header-amount{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 12px;background:linear-gradient(135deg,rgba(16,185,129,.12),rgba(5,150,105,.05));border:1.5px solid rgba(16,185,129,.30);border-radius:11px;min-width:72px;flex-shrink:0}
.amount-value{font-size:17px;font-weight:900;color:var(--success-dark);line-height:1;letter-spacing:-.5px}
.amount-label{font-size:8px;color:var(--success-dark);font-weight:700;letter-spacing:.4px;text-transform:uppercase;margin-top:2px;opacity:.75}

/* ============ TASK HERO ============ */
.task-hero{position:relative;width:100%;aspect-ratio:16/9;max-height:200px;background:#000;overflow:hidden;border-bottom:1px solid var(--border)}
.task-hero-img{width:100%;height:100%;object-fit:cover;display:block}

/* ============ TASK INFO BLOCK ============ */
.task-info-block{padding:14px 16px 12px;display:flex;flex-direction:column;gap:10px}
.task-hero-title{position:relative;font-size:14.5px;font-weight:700;line-height:1.4;margin:0;padding-left:11px;letter-spacing:-.2px;color:var(--text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.task-hero-title::before{content:'';position:absolute;left:0;top:3px;bottom:3px;width:3px;border-radius:2px;background:linear-gradient(180deg,#6366f1,#8b5cf6,#06b6d4)}
.channel-row{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.task-hero-channel-wrap{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;background:linear-gradient(135deg,rgba(6,182,212,.10),rgba(99,102,241,.10));border:1px solid rgba(6,182,212,.25);border-radius:20px;max-width:100%;min-width:0}
.task-hero-channel-icon{width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#06b6d4,#6366f1);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-size:9px;font-weight:800}
.task-hero-channel{font-size:11.5px;color:#0891b2;font-weight:700;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:.2px}
.channel-right{display:inline-flex;align-items:center;gap:6px;padding:4px 6px 4px 10px;background:var(--surface-2);border:1px solid var(--border);border-radius:20px;flex-shrink:0}
.channel-number{font-size:11px;font-weight:700;color:var(--accent);letter-spacing:.5px;font-variant-numeric:tabular-nums;white-space:nowrap}
.channel-edit-btn{width:22px;height:22px;display:flex;align-items:center;justify-content:center;background:rgba(99,102,241,.12);border:none;border-radius:50%;color:var(--accent);cursor:pointer;transition:all .15s;flex-shrink:0}
.channel-edit-btn:hover{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;transform:scale(1.1)}
.tags-wrap{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:2px}
.tag-chip{display:inline-flex;align-items:center;gap:4px;padding:6px 12px;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.20);border-radius:20px;color:var(--accent);font-size:10.5px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .18s;line-height:1.3;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tag-chip:hover{background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.12));border-color:rgba(99,102,241,.40);transform:translateY(-1px)}
.tag-chip svg{flex-shrink:0;opacity:.65;width:10px;height:10px}
.divider{height:1px;margin:0;background:var(--border)}

/* ============ LIVE COUNTER STRIP ============ */
.live-counter-strip{display:flex;flex-direction:column;gap:5px;padding:10px 16px;background:linear-gradient(135deg,rgba(16,185,129,.04),rgba(99,102,241,.03));border-top:1px solid var(--border);border-bottom:1px solid var(--border);position:relative;z-index:1}
.live-counter-strip .live-counter-head{display:flex;justify-content:space-between;align-items:center;font-size:10.5px;font-weight:700;letter-spacing:.5px}
.live-counter-strip .live-dot-wrap{display:inline-flex;align-items:center;gap:5px;color:var(--success-dark);font-size:10.5px}
.live-counter-strip .live-dot{width:6px;height:6px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;animation:pulse-dot 1.5s ease infinite}
.live-counter-strip .live-count{color:var(--accent);font-variant-numeric:tabular-nums;font-size:13px;font-weight:800}
.live-counter-strip .live-bar{height:5px;background:rgba(99,102,241,.10);border-radius:3px;overflow:hidden}
.live-counter-strip .live-fill{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4);border-radius:3px;transition:width .4s;box-shadow:0 0 10px rgba(139,92,246,.40)}
@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}

/* ============ SUBMITTED BLOCK ============ */
.submitted-block{padding:20px 18px;display:flex;flex-direction:column;gap:14px}
.submitted-badge{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 18px;background:linear-gradient(135deg,rgba(16,185,129,.10),rgba(5,150,105,.05));border:1.5px solid rgba(16,185,129,.30);border-radius:12px;color:var(--success-dark);font-size:13px;font-weight:800;letter-spacing:.3px;margin:0 auto}
.submitted-badge svg{width:16px;height:16px}
.submitted-preview{position:relative;background:#000;border:1px solid var(--border);border-radius:14px;overflow:hidden;aspect-ratio:16/10;box-shadow:var(--shadow-md)}
.submitted-frame{width:100%;height:100%;object-fit:contain;display:block;background:#000}
.submitted-preview video{width:100%;height:100%;object-fit:contain;display:block;background:#000}
.submitted-info{padding:12px 14px;background:var(--surface);border-top:1px solid var(--border);display:flex;flex-direction:column;gap:4px}
.submitted-label{font-size:10px;color:var(--success-dark);font-weight:700;letter-spacing:.5px;text-transform:uppercase}
.submitted-name{font-size:13px;color:var(--text);font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.submitted-time{font-size:11px;color:var(--text-3);font-weight:600;font-variant-numeric:tabular-nums}
.btn-mistake{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin:0 auto;padding:14px 18px;background:linear-gradient(135deg,rgba(245,158,11,.10),rgba(217,119,6,.05));border:1.5px solid rgba(245,158,11,.35);border-radius:12px;color:#d97706;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;transition:all .2s}
.btn-mistake:hover{background:linear-gradient(135deg,rgba(245,158,11,.18),rgba(217,119,6,.10));transform:translateY(-1px);box-shadow:0 6px 20px rgba(245,158,11,.20)}
.btn-mistake svg{flex-shrink:0;width:14px;height:14px}

/* ============ RESUBMIT NOTICE ============ */
.resubmit-notice{display:flex;align-items:center;gap:8px;padding:12px 14px;background:linear-gradient(135deg,rgba(6,182,212,.08),rgba(14,116,144,.04));border:1px solid rgba(6,182,212,.30);border-radius:11px;color:#0891b2;font-size:12px;font-weight:700;letter-spacing:.2px;margin-bottom:8px}
.resubmit-notice svg{flex-shrink:0;width:14px;height:14px}

/* ============ FINAL BLOCK ============ */
.final-block{padding:40px 24px 36px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;animation:fadeIn .5s ease}
.final-icon{width:78px;height:78px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;color:#fff;box-shadow:0 20px 50px rgba(16,185,129,.30),0 0 0 8px rgba(16,185,129,.08);animation:pop .5s cubic-bezier(.2,1.4,.4,1)}
.final-icon svg{width:34px;height:34px;stroke-width:3}
@keyframes pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
.final-title{margin:6px 0 0;font-size:21px;font-weight:800;color:var(--text);letter-spacing:-.4px}
.final-sub{margin:0;font-size:13.5px;color:var(--text-2);line-height:1.5;max-width:280px}

/* ============ TASK OVER BLOCK ============ */
.taskover-block{position:relative;padding:48px 28px 36px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;overflow:hidden}
.taskover-glow{position:absolute;top:-40%;left:50%;transform:translateX(-50%);width:280px;height:280px;background:radial-gradient(circle,rgba(239,68,68,.15),transparent 70%);pointer-events:none;filter:blur(40px)}
.taskover-icon{position:relative;width:88px;height:88px;display:flex;align-items:center;justify-content:center;border-radius:24px;background:linear-gradient(135deg,rgba(239,68,68,.10),rgba(220,38,38,.04));border:2px solid rgba(239,68,68,.30);color:#dc2626;box-shadow:0 12px 40px rgba(239,68,68,.20),0 0 0 8px rgba(239,68,68,.04);animation:pop .5s cubic-bezier(.2,1.4,.4,1)}
.taskover-icon svg{width:44px;height:44px}
.taskover-title{position:relative;margin:4px 0 0;font-size:24px;font-weight:800;letter-spacing:-.5px;color:var(--text)}
.taskover-sub{position:relative;margin:0;font-size:13.5px;color:var(--text-2);line-height:1.5;max-width:300px}
.taskover-stats{position:relative;display:flex;align-items:center;gap:20px;margin-top:8px;padding:14px 24px;background:var(--surface-2);border:1px solid var(--border);border-radius:16px}
.taskover-stat{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:60px}
.taskover-stat-num{font-size:22px;font-weight:800;color:#dc2626;font-variant-numeric:tabular-nums;letter-spacing:-.5px}
.taskover-stat-label{font-size:9.5px;font-weight:700;color:var(--text-3);letter-spacing:.6px;text-transform:uppercase}
.taskover-stat-divider{width:1px;height:32px;background:var(--border)}
.taskover-btn{position:relative;display:inline-flex;align-items:center;gap:8px;margin-top:12px;padding:12px 22px;background:rgba(99,102,241,.08);border:1.5px solid rgba(99,102,241,.25);border-radius:14px;color:var(--accent);font-size:13.5px;font-weight:700;text-decoration:none;transition:all .2s;font-family:inherit}
.taskover-btn:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.45);transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,102,241,.20)}
.taskover-btn svg{width:14px;height:14px;flex-shrink:0}

/* ============ UPLOAD ============ */
.upload{padding:24px 22px 22px;display:flex;flex-direction:column;gap:16px}
.compact-upload{padding:16px 18px 16px;gap:10px}
.picker-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pick{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:18px 12px;background:var(--surface-2);border:1.5px dashed var(--border-hover);border-radius:14px;cursor:pointer;transition:all .2s;font-family:inherit;color:inherit;min-height:130px;text-align:center}
.compact-upload .pick{min-height:80px;padding:12px 8px;gap:6px}
.pick:hover{border-color:var(--accent);background:rgba(99,102,241,.04);transform:translateY(-2px)}
.pick.dragging{border-color:var(--accent);background:rgba(99,102,241,.08);transform:scale(1.02)}
.pick.done{border-style:solid;border-color:rgba(16,185,129,.40);background:rgba(16,185,129,.05)}
.pick-icon{width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.08));border:1px solid rgba(99,102,241,.25);border-radius:12px;color:var(--accent);flex-shrink:0;transition:all .2s}
.compact-upload .pick-icon{width:34px;height:34px}
.pick.done .pick-icon{color:var(--success-dark);border-color:rgba(16,185,129,.35);background:linear-gradient(135deg,rgba(16,185,129,.15),rgba(16,185,129,.05))}
.pick-text{display:flex;flex-direction:column;gap:2px;min-width:0}
.pick-text strong{font-size:13.5px;font-weight:700;color:var(--text);line-height:1.3}
.compact-upload .pick-text strong{font-size:12px}
.pick-text span{font-size:11px;color:var(--text-3);line-height:1.3}
.compact-upload .pick-text span{font-size:10px}
.pick.done .pick-text strong{color:var(--success-dark)}
.preview{position:relative;border-radius:14px;overflow:hidden;background:#000;aspect-ratio:16/10;border:1px solid var(--border)}
.preview video{width:100%;height:100%;object-fit:contain;display:block;background:#000}
.preview-small{aspect-ratio:16/9;max-height:90px;max-width:180px;margin:0 auto}
.preview-small video{max-height:90px}
.play-btn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:56px;height:56px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.95);border:none;border-radius:50%;color:#000;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.30),0 0 0 4px rgba(255,255,255,.20);transition:all .15s}
.play-btn-small{width:30px;height:30px}
.play-btn-small svg{width:12px;height:12px}
.play-btn:hover{transform:translate(-50%,-50%) scale(1.08)}
.preview-tags{position:absolute;bottom:8px;right:8px;display:flex;gap:5px}
.preview-small .preview-tags{bottom:5px;right:5px;gap:3px}
.tag{padding:4px 8px;background:rgba(0,0,0,.75);color:#fff;border-radius:6px;font-size:10px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.3px;border:1px solid rgba(255,255,255,.15)}
.preview-small .tag{padding:3px 6px;font-size:9px}
.timeline{display:flex;flex-direction:column;gap:8px;padding:12px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px}
.timeline-head{display:flex;justify-content:space-between;font-size:12px;font-weight:500;color:var(--text-2)}
.timeline-head .time{color:var(--accent);font-weight:700;font-variant-numeric:tabular-nums}
.timeline-bar{position:relative;height:6px;background:rgba(99,102,241,.10);border-radius:3px;overflow:visible}
.timeline-fill{position:absolute;top:0;left:0;bottom:0;background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4);border-radius:3px;transition:width .1s linear}
.timeline-markers{position:absolute;inset:0;pointer-events:none}
.dot{position:absolute;top:50%;transform:translate(-50%,-50%);width:12px;height:12px;background:#fff;border:2px solid var(--border-hover);border-radius:50%;transition:all .25s}
.dot.passed{background:#10b981;border-color:#10b981}
.dot.current{border-color:#8b5cf6;background:#fff;transform:translate(-50%,-50%) scale(1.4);box-shadow:0 0 0 4px rgba(139,92,246,.20);animation:dot-pulse 1s infinite}
@keyframes dot-pulse{50%{box-shadow:0 0 0 8px rgba(139,92,246,.10)}}
.ready{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--success-soft);border:1px solid rgba(16,185,129,.20);border-radius:12px}
.compact-upload .ready{padding:10px 12px;gap:10px}
.ready-check{width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;color:#fff;flex-shrink:0;box-shadow:0 4px 12px rgba(16,185,129,.30)}
.compact-upload .ready-check{width:28px;height:28px}
.ready>div:last-child{display:flex;flex-direction:column;gap:2px}
.ready strong{font-size:14px;font-weight:700;color:var(--text);line-height:1.3}
.compact-upload .ready strong{font-size:13px}
.ready span{font-size:12px;color:var(--text-2);line-height:1.3}
.compact-upload .ready span{font-size:11px}
.progress{display:flex;flex-direction:column;gap:10px;padding:14px 16px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px}
.progress-head{display:flex;justify-content:space-between;align-items:baseline;font-size:13px}
.progress-head span{color:var(--text-2);font-weight:500}
.progress-head strong{color:var(--accent);font-size:20px;font-weight:800;font-variant-numeric:tabular-nums}
.progress-bar{height:6px;background:rgba(99,102,241,.10);border-radius:3px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4);border-radius:3px;transition:width .3s}
.status-msg{font-size:12.5px;color:var(--text-2);padding:10px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;text-align:center}
.actions{display:grid;grid-template-columns:auto 1fr;gap:10px;margin-top:4px}
.compact-upload .actions{gap:8px}
.compact-upload .btn-ghost,.compact-upload .btn-primary{height:44px;font-size:13.5px}

/* ============ STATE BOXES ============ */
.state-box{padding:60px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px}
.state-icon{font-size:56px;margin-bottom:8px;opacity:.85}
.state-icon-over{filter:hue-rotate(340deg) saturate(1.5)}
.state-title{font-size:20px;font-weight:800;color:var(--text);letter-spacing:-.3px;margin:0}
.state-sub{font-size:13.5px;color:var(--text-2);margin:0;line-height:1.5}
.state-text{font-size:13px;color:var(--text-2);margin-top:12px}
.spinner{width:36px;height:36px;border:3px solid rgba(99,102,241,.15);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

/* ============ MODALS ============ */
.modal-backdrop{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(15,23,42,.40);backdrop-filter:blur(8px);animation:fadeIn .25s ease}
.modal{width:100%;max-width:360px;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:20px;box-shadow:0 20px 60px rgba(15,23,42,.20);display:flex;flex-direction:column;gap:16px;animation:pop .3s cubic-bezier(.2,1.2,.4,1)}
.modal-head{display:flex;align-items:center;justify-content:space-between}
.modal-head h3{margin:0;font-size:17px;font-weight:700;color:var(--text);letter-spacing:-.2px}

/* ============ BACK HOME LINK ============ */
.back-home-link{display:inline-flex;align-items:center;margin-top:16px;padding:10px 18px;background:rgba(99,102,241,.08);border:1.5px solid rgba(99,102,241,.20);border-radius:12px;color:var(--accent);font-size:13px;font-weight:700;text-decoration:none;transition:all .15s}
.back-home-link:hover{background:rgba(99,102,241,.15);transform:translateY(-1px)}

/* ============ MY SUBMISSIONS PAGE ============ */
.my-card{max-width:420px;max-height:calc(100dvh - 32px);display:flex;flex-direction:column;overflow:hidden;padding:0}
.my-header{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--border)}
.my-back-btn{width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:var(--surface-2);border:1.5px solid var(--border);border-radius:10px;color:var(--text);cursor:pointer;transition:all .15s;flex-shrink:0}
.my-back-btn:hover{background:rgba(99,102,241,.08);border-color:var(--accent);color:var(--accent)}
.my-header-info{flex:1;min-width:0;text-align:center}
.my-header-title{font-size:15px;font-weight:700;color:var(--text);letter-spacing:-.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.my-header-sub{font-size:10.5px;color:var(--text-3);font-weight:500;margin-top:2px}
.my-header-spacer{width:34px;flex-shrink:0}
.my-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:12px 16px 4px}
.my-stat{padding:12px 8px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;text-align:center}
.my-stat-num{font-size:20px;font-weight:800;color:var(--accent);letter-spacing:-.5px;font-variant-numeric:tabular-nums;line-height:1;margin-bottom:4px}
.my-stat-label{font-size:9.5px;color:var(--text-3);font-weight:700;letter-spacing:.5px;text-transform:uppercase}
.my-content{flex:1;overflow-y:auto;padding:16px}
.my-content::-webkit-scrollbar{width:5px}
.my-content::-webkit-scrollbar-thumb{background:rgba(99,102,241,.20);border-radius:3px}
.my-section-title{font-size:11px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}
.my-chips{display:flex;flex-wrap:wrap;gap:8px}
.my-chip{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-size:12.5px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .15s}
.my-chip:hover{background:rgba(99,102,241,.08);border-color:rgba(99,102,241,.35);transform:translateY(-1px)}
.my-chip svg{color:var(--accent);flex-shrink:0}
.my-chip-count{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:18px;padding:0 7px;background:rgba(99,102,241,.12);border-radius:9px;font-size:10px;font-weight:800;color:var(--accent);font-variant-numeric:tabular-nums}
.my-bot-chip{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;font-size:12.5px;font-weight:600;color:var(--text)}
.my-bot-chip svg{color:var(--accent);flex-shrink:0}
.my-bot-name{text-transform:capitalize;font-weight:700;letter-spacing:.3px}

/* ============ RESPONSIVE ============ */
@media (max-width:420px){
.app-shell{padding:12px;align-items:flex-start;padding-top:16px}
.card{border-radius:20px}
.welcome{padding:32px 22px 26px}
.upload{padding:20px 18px 18px}
.welcome h1{font-size:22px}
.pick{min-height:118px;padding:16px 10px}
.pick-icon{width:40px;height:40px}
.task-hero{max-height:170px}
.task-info-block{padding:12px 14px 10px;gap:8px}
.task-hero-title{font-size:13px}
.task-hero-channel{font-size:10.5px}
.channel-number{font-size:10px}
.channel-edit-btn{width:20px;height:20px}
.tag-chip{font-size:10px;padding:5px 10px}
.compact-welcome{padding:18px 18px 16px}
.compact-upload{padding:14px 16px}
.preview-small{max-height:80px;max-width:160px}
.preview-small video{max-height:80px}
.play-btn-small{width:28px;height:28px}
.state-box{padding:50px 20px}
.home-card{border-radius:20px}
.home-header{padding:16px 18px 10px}
.home-title{font-size:17px}
.task-list-item{padding:8px;gap:8px}
.task-list-thumb-wrap{width:85px;height:60px}
.task-list-title{font-size:10.5px}
.task-list-channel{font-size:9px}
.bot-header-bar{padding:8px 10px;gap:6px}
.bot-back-btn{width:32px;height:32px}
.bot-back-btn svg{width:14px;height:14px}
.bot-header-watch{padding:8px 10px;font-size:9.5px}
.bot-header-amount{padding:5px 10px;min-width:66px}
.amount-value{font-size:15px}
.amount-label{font-size:7.5px}
.live-counter-strip{padding:8px 12px;gap:4px}
.live-counter-strip .live-count{font-size:12px}
.submitted-block{padding:16px 14px;gap:12px}
.submitted-badge{font-size:12px;padding:9px 14px}
.final-block{padding:32px 20px 28px}
.final-icon{width:66px;height:66px}
.final-title{font-size:18px}
.final-sub{font-size:12.5px}
.btn-mistake{padding:12px 14px;font-size:12px}
.taskover-block{padding:36px 20px 28px;gap:12px}
.taskover-icon{width:72px;height:72px}
.taskover-icon svg{width:36px;height:36px}
.taskover-title{font-size:20px}
.taskover-sub{font-size:12.5px}
.taskover-stats{padding:12px 18px;gap:16px}
.taskover-stat-num{font-size:19px}
.taskover-btn{padding:10px 18px;font-size:12.5px}
}
@media (prefers-reduced-motion:reduce){
*,*::before,*::after{animation-duration:.01ms !important;transition-duration:.01ms !important}
.ambient{animation:none}
}