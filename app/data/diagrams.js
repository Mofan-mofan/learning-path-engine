// 知识节点示意图（内联 SVG，矢量、无外部依赖）
// 键 = node_id，值 = SVG 字符串。渲染在详情面板"概念说明"上方。
// 增补方法：直接在此对象里加 'node_id': `<svg ...>...</svg>` 即可，无需改代码。
window.GRAPH_DIAGRAMS = {

  'sp.crystal': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#94a3b8" stroke-width="1.5" fill="#e2e8f0">
      <line x1="35" y1="45" x2="60" y2="75"/><line x1="85" y1="45" x2="60" y2="75"/>
      <line x1="35" y1="105" x2="60" y2="75"/><line x1="85" y1="105" x2="60" y2="75"/>
      <circle cx="35" cy="45" r="9"/><circle cx="85" cy="45" r="9"/><circle cx="60" cy="75" r="9"/>
      <circle cx="35" cy="105" r="9"/><circle cx="85" cy="105" r="9"/>
    </g>
    <text x="60" y="132" font-size="11" text-anchor="middle" fill="#475569">硅金刚石晶格</text>
    <rect x="170" y="18" width="150" height="32" fill="#bfdbfe"/>
    <text x="245" y="38" font-size="11" text-anchor="middle" fill="#1e40af">导带 Ec</text>
    <rect x="170" y="50" width="150" height="46" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="245" y="77" font-size="11" text-anchor="middle" fill="#64748b">禁带 Eg≈1.1eV</text>
    <rect x="170" y="96" width="150" height="32" fill="#fecaca"/>
    <text x="245" y="116" font-size="11" text-anchor="middle" fill="#991b1b">价带 Ev</text>
    <text x="245" y="145" font-size="11" text-anchor="middle" fill="#475569">能带结构</text>
  </svg>`,

  'sp.carrier.stats': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="15" width="130" height="120" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="85" y="30" font-size="11" text-anchor="middle" fill="#1e40af">n 型</text>
    <line x1="30" y1="55" x2="140" y2="55" stroke="#16a34a" stroke-width="2" stroke-dasharray="5 3"/>
    <text x="85" y="50" font-size="10" text-anchor="middle" fill="#16a34a">Ef 靠近导带</text>
    <rect x="200" y="15" width="130" height="120" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="265" y="30" font-size="11" text-anchor="middle" fill="#991b1b">p 型</text>
    <line x1="210" y1="105" x2="320" y2="105" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 3"/>
    <text x="265" y="122" font-size="10" text-anchor="middle" fill="#dc2626">Ef 靠近价带</text>
    <text x="170" y="145" font-size="11" text-anchor="middle" fill="#475569">掺杂移动费米能级 Ef</text>
  </svg>`,

  'sp.carrier.transport': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <text x="85" y="20" font-size="11" text-anchor="middle" fill="#475569">漂移（电场驱动）</text>
    <line x1="30" y1="60" x2="140" y2="60" stroke="#2563eb" stroke-width="2" marker-end="url(#ar)"/>
    <text x="85" y="52" font-size="10" text-anchor="middle" fill="#2563eb">E</text>
    <circle cx="60" cy="85" r="6" fill="#2563eb"/><circle cx="90" cy="85" r="6" fill="#2563eb"/>
    <line x1="60" y1="85" x2="78" y2="85" stroke="#2563eb" marker-end="url(#ar)"/>
    <text x="255" y="20" font-size="11" text-anchor="middle" fill="#475569">扩散（浓度梯度）</text>
    <g fill="#16a34a"><circle cx="210" cy="70" r="6"/><circle cx="225" cy="85" r="6"/><circle cx="215" cy="100" r="6"/><circle cx="260" cy="85" r="6"/><circle cx="300" cy="90" r="6"/></g>
    <line x1="230" y1="85" x2="290" y2="85" stroke="#16a34a" stroke-width="2" marker-end="url(#ar)"/>
    <text x="255" y="120" font-size="10" text-anchor="middle" fill="#16a34a">高浓度 → 低浓度</text>
    <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
    <text x="170" y="145" font-size="11" text-anchor="middle" fill="#475569">J = qnμE + qD∇n</text>
  </svg>`,

  'sp.pn.equilibrium': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="30" width="120" height="70" fill="#fecaca"/>
    <rect x="150" y="30" width="60" height="70" fill="#e2e8f0"/>
    <rect x="210" y="30" width="100" height="70" fill="#bfdbfe"/>
    <text x="90" y="70" font-size="12" text-anchor="middle" fill="#991b1b">P</text>
    <text x="180" y="70" font-size="11" text-anchor="middle" fill="#475569">耗尽层</text>
    <text x="260" y="70" font-size="12" text-anchor="middle" fill="#1e40af">N</text>
    <path d="M60 118 L150 118 L210 132 L300 132" stroke="#475569" fill="none" stroke-width="2"/>
    <text x="170" y="147" font-size="11" text-anchor="middle" fill="#475569">能带弯曲 · 内建电势 Vbi</text>
  </svg>`,

  'sp.pn.bias': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <text x="90" y="20" font-size="11" text-anchor="middle" fill="#16a34a">正偏：势垒降低</text>
    <path d="M30 90 L90 90 L90 60 L150 60" stroke="#16a34a" fill="none" stroke-width="2"/>
    <text x="90" y="115" font-size="10" text-anchor="middle" fill="#16a34a">电流指数↑</text>
    <text x="255" y="20" font-size="11" text-anchor="middle" fill="#dc2626">反偏：势垒升高</text>
    <path d="M195 60 L255 60 L255 100 L315 100" stroke="#dc2626" fill="none" stroke-width="2"/>
    <text x="255" y="125" font-size="10" text-anchor="middle" fill="#dc2626">仅微小饱和电流</text>
    <text x="170" y="145" font-size="11" text-anchor="middle" fill="#475569">I = I0(exp(qV/kT)-1)</text>
  </svg>`,

  'sp.mos.cap': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="120" x2="310" y2="120" stroke="#94a3b8"/>
    <line x1="30" y1="120" x2="30" y2="20" stroke="#94a3b8"/>
    <path d="M40 40 C90 40 110 40 140 70 C170 100 200 108 300 108" stroke="#2563eb" fill="none" stroke-width="2.5"/>
    <text x="60" y="32" font-size="10" fill="#1e40af">积累</text>
    <text x="140" y="60" font-size="10" fill="#475569">耗尽</text>
    <text x="250" y="100" font-size="10" fill="#16a34a">反型</text>
    <text x="300" y="135" font-size="10" text-anchor="end" fill="#475569">Vg →</text>
    <text x="40" y="15" font-size="10" fill="#475569">C ↑</text>
    <text x="170" y="145" font-size="11" text-anchor="middle" fill="#475569">高频 C-V 曲线</text>
  </svg>`,

  'sp.mosfet.iv': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="60" width="130" height="50" fill="#e2e8f0" stroke="#94a3b8"/>
    <rect x="60" y="45" width="60" height="15" fill="#94a3b8"/>
    <text x="90" y="40" font-size="10" text-anchor="middle" fill="#475569">栅 G</text>
    <rect x="30" y="55" width="25" height="10" fill="#2563eb"/><text x="42" y="50" font-size="9" text-anchor="middle" fill="#1e40af">S</text>
    <rect x="125" y="55" width="25" height="10" fill="#2563eb"/><text x="137" y="50" font-size="9" text-anchor="middle" fill="#1e40af">D</text>
    <text x="90" y="128" font-size="10" text-anchor="middle" fill="#475569">MOSFET 截面</text>
    <line x1="200" y1="120" x2="320" y2="120" stroke="#94a3b8"/>
    <line x1="200" y1="120" x2="200" y2="20" stroke="#94a3b8"/>
    <path d="M200 120 C220 70 240 60 320 58" stroke="#16a34a" fill="none" stroke-width="2"/>
    <path d="M200 120 C220 85 240 78 320 76" stroke="#2563eb" fill="none" stroke-width="2"/>
    <path d="M200 120 C220 100 240 96 320 94" stroke="#f59e0b" fill="none" stroke-width="2"/>
    <text x="315" y="135" font-size="10" text-anchor="end" fill="#475569">Vds →</text>
    <text x="255" y="145" font-size="11" text-anchor="middle" fill="#475569">Id-Vds 族曲线（不同 Vgs）</text>
  </svg>`,

  'sp.mosfet.vth': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="20" width="120" height="18" fill="#94a3b8"/><text x="100" y="33" font-size="10" text-anchor="middle" fill="#fff">金属栅</text>
    <rect x="40" y="38" width="120" height="14" fill="#bfdbfe"/><text x="100" y="49" font-size="9" text-anchor="middle" fill="#1e40af">氧化层 Cox</text>
    <rect x="40" y="52" width="120" height="40" fill="#e2e8f0"/><text x="100" y="76" font-size="10" text-anchor="middle" fill="#475569">衬底（掺杂）</text>
    <text x="190" y="30" font-size="11" fill="#475569">Vth = VFB</text>
    <text x="190" y="52" font-size="11" fill="#475569">+ 2φF</text>
    <text x="190" y="74" font-size="11" fill="#475569">+ Qdep / Cox</text>
    <text x="170" y="120" font-size="11" text-anchor="middle" fill="#475569">三项：功函数差 / 表面势 / 耗尽电荷</text>
    <text x="170" y="142" font-size="10" text-anchor="middle" fill="#64748b">掺杂↑ 或 Cox↓ → Vth 变化</text>
  </svg>`,

  'sp.mosfet.subthreshold': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="120" x2="310" y2="120" stroke="#94a3b8"/>
    <line x1="40" y1="120" x2="40" y2="15" stroke="#94a3b8"/>
    <path d="M40 112 L150 100 L200 60 L240 30" stroke="#2563eb" fill="none" stroke-width="2.5"/>
    <line x1="150" y1="100" x2="150" y2="120" stroke="#dc2626" stroke-dasharray="4 3"/>
    <text x="150" y="135" font-size="10" text-anchor="middle" fill="#dc2626">Vth</text>
    <text x="90" y="90" font-size="10" fill="#475569">亚阈值区（指数）</text>
    <text x="250" y="40" font-size="10" fill="#16a34a">强反型</text>
    <text x="300" y="135" font-size="10" text-anchor="end" fill="#475569">Vgs →</text>
    <text x="50" y="12" font-size="10" fill="#475569">log Id</text>
    <text x="170" y="147" font-size="11" text-anchor="middle" fill="#475569">SS = 斜率倒数 ≈ 60 mV/dec（室温极限）</text>
  </svg>`,

  'sp.mosfet.leakage': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="60" y="70" width="220" height="45" fill="#e2e8f0" stroke="#94a3b8"/>
    <rect x="130" y="52" width="80" height="18" fill="#94a3b8"/>
    <path d="M170 52 L170 70" stroke="#dc2626" stroke-width="2" marker-end="url(#ar2)"/>
    <text x="200" y="45" font-size="10" fill="#dc2626">栅隧穿漏电</text>
    <path d="M95 70 C120 85 150 85 170 70" stroke="#f59e0b" fill="none" stroke-width="2" marker-end="url(#ar2)"/>
    <text x="60" y="100" font-size="10" fill="#b45309">亚阈值漏电</text>
    <path d="M250 70 L250 115" stroke="#2563eb" stroke-width="2" marker-end="url(#ar2)"/>
    <text x="262" y="105" font-size="10" fill="#1e40af">结漏电</text>
    <defs><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
    <text x="170" y="140" font-size="11" text-anchor="middle" fill="#475569">三大漏电机制</text>
  </svg>`,

  'dev.shortchannel': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="110" x2="310" y2="110" stroke="#94a3b8"/>
    <line x1="40" y1="110" x2="40" y2="25" stroke="#94a3b8"/>
    <path d="M40 40 C100 40 140 55 180 80 C220 100 260 105 310 105" stroke="#dc2626" fill="none" stroke-width="2.5"/>
    <text x="70" y="32" font-size="10" fill="#dc2626">长沟道 Vth 高</text>
    <text x="250" y="95" font-size="10" fill="#dc2626">短沟道 Vth roll-off</text>
    <text x="300" y="125" font-size="10" text-anchor="end" fill="#475569">沟道长度 L →</text>
    <text x="170" y="142" font-size="11" text-anchor="middle" fill="#475569">L 减小 → 栅控减弱 → Vth 下降 / DIBL</text>
  </svg>`,

  'dev.finfet': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <text x="80" y="20" font-size="11" text-anchor="middle" fill="#475569">平面 MOSFET</text>
    <rect x="30" y="70" width="100" height="35" fill="#e2e8f0" stroke="#94a3b8"/>
    <rect x="55" y="58" width="50" height="12" fill="#94a3b8"/>
    <text x="80" y="52" font-size="9" text-anchor="middle" fill="#475569">栅（单面）</text>
    <text x="250" y="20" font-size="11" text-anchor="middle" fill="#16a34a">FinFET（三面包裹）</text>
    <rect x="200" y="80" width="100" height="25" fill="#e2e8f0" stroke="#94a3b8"/>
    <rect x="240" y="35" width="20" height="45" fill="#bfdbfe" stroke="#2563eb"/>
    <path d="M235 35 L235 80 M265 35 L265 80 M235 35 L265 35" stroke="#16a34a" stroke-width="3" fill="none"/>
    <text x="250" y="122" font-size="9" text-anchor="middle" fill="#16a34a">栅包裹鳍片三面</text>
    <text x="170" y="145" font-size="11" text-anchor="middle" fill="#475569">鳍片 Wfin / Hfin 为关键参数</text>
  </svg>`,

  'dev.gaa': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="120" y="60" width="100" height="16" fill="#bfdbfe" stroke="#2563eb"/>
    <rect x="120" y="60" width="100" height="16" fill="none" stroke="#16a34a" stroke-width="4"/>
    <text x="170" y="50" font-size="10" text-anchor="middle" fill="#16a34a">栅四面包裹</text>
    <text x="170" y="92" font-size="10" text-anchor="middle" fill="#1e40af">沟道纳米片</text>
    <rect x="120" y="100" width="100" height="16" fill="#bfdbfe" stroke="#2563eb"/>
    <rect x="120" y="100" width="100" height="16" fill="none" stroke="#16a34a" stroke-width="4"/>
    <text x="170" y="140" font-size="11" text-anchor="middle" fill="#475569">GAA 纳米片堆叠（栅控最强）</text>
  </svg>`,

  'dev.hkmg': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <text x="90" y="20" font-size="11" text-anchor="middle" fill="#dc2626">SiO2 太薄→隧穿</text>
    <rect x="50" y="30" width="80" height="8" fill="#fecaca" stroke="#dc2626"/>
    <rect x="50" y="38" width="80" height="40" fill="#e2e8f0"/>
    <text x="250" y="20" font-size="11" text-anchor="middle" fill="#16a34a">高κ 物理厚、EOT 同</text>
    <rect x="210" y="30" width="80" height="24" fill="#bbf7d0" stroke="#16a34a"/>
    <rect x="210" y="54" width="80" height="40" fill="#e2e8f0"/>
    <text x="170" y="110" font-size="10" text-anchor="middle" fill="#475569">衬底</text>
    <text x="170" y="140" font-size="11" text-anchor="middle" fill="#475569">同 EOT 下高κ更厚 → 栅漏电↓</text>
  </svg>`,

  'proc.litho': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <g font-size="11" text-anchor="middle">
      <rect x="15" y="55" width="62" height="34" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="46" y="76" fill="#1e40af">涂胶</text>
      <rect x="92" y="55" width="62" height="34" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="123" y="76" fill="#1e40af">曝光</text>
      <rect x="169" y="55" width="62" height="34" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="200" y="76" fill="#1e40af">显影</text>
      <rect x="246" y="55" width="62" height="34" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="277" y="76" fill="#1e40af">刻蚀</text>
    </g>
    <g stroke="#475569" stroke-width="2" marker-end="url(#ar3)">
      <line x1="77" y1="72" x2="90" y2="72"/><line x1="154" y1="72" x2="167" y2="72"/><line x1="231" y1="72" x2="244" y2="72"/>
    </g>
    <defs><marker id="ar3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#475569"/></marker></defs>
    <text x="170" y="120" font-size="11" text-anchor="middle" fill="#475569">R = k1·λ / NA（瑞利公式）</text>
    <text x="170" y="140" font-size="10" text-anchor="middle" fill="#64748b">多重曝光（SAQP）突破单次分辨率极限</text>
  </svg>`,

  'proc.etch': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <text x="90" y="20" font-size="11" text-anchor="middle" fill="#475569">各向同性（湿法）</text>
    <path d="M50 40 L130 40 L130 60 C130 90 110 100 90 100 C70 100 50 90 50 60 Z" fill="#e2e8f0" stroke="#94a3b8"/>
    <text x="250" y="20" font-size="11" text-anchor="middle" fill="#16a34a">各向异性（干法）</text>
    <path d="M210 40 L290 40 L290 100 L210 100 Z" fill="#e2e8f0" stroke="#16a34a"/>
    <rect x="228" y="40" width="44" height="60" fill="#f8fafc"/>
    <text x="170" y="130" font-size="11" text-anchor="middle" fill="#475569">干法可刻高深宽比精细图形</text>
  </svg>`,

  'proc.integration': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <g font-size="10" text-anchor="middle">
      <rect x="20" y="25" width="60" height="28" rx="5" fill="#fef3c7" stroke="#f59e0b"/><text x="50" y="43" fill="#92400e">光刻</text>
      <rect x="100" y="25" width="60" height="28" rx="5" fill="#fef3c7" stroke="#f59e0b"/><text x="130" y="43" fill="#92400e">刻蚀</text>
      <rect x="180" y="25" width="60" height="28" rx="5" fill="#fef3c7" stroke="#f59e0b"/><text x="210" y="43" fill="#92400e">沉积</text>
      <rect x="260" y="25" width="60" height="28" rx="5" fill="#fef3c7" stroke="#f59e0b"/><text x="290" y="43" fill="#92400e">注入</text>
      <rect x="140" y="80" width="80" height="30" rx="5" fill="#d1fae5" stroke="#10b981"/><text x="180" y="99" fill="#065f46">工艺集成</text>
    </g>
    <g stroke="#475569" stroke-width="1.5" marker-end="url(#ar4)">
      <line x1="50" y1="53" x2="160" y2="80"/><line x1="130" y1="53" x2="170" y2="80"/><line x1="210" y1="53" x2="190" y2="80"/><line x1="290" y1="53" x2="200" y2="80"/>
    </g>
    <defs><marker id="ar4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#475569"/></marker></defs>
    <text x="170" y="135" font-size="11" text-anchor="middle" fill="#475569">单项工艺按序组合成完整器件</text>
  </svg>`,

  'char.iv': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="40" width="90" height="50" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
    <text x="75" y="68" font-size="10" text-anchor="middle" fill="#475569">器件 DUT</text>
    <rect x="180" y="40" width="110" height="50" rx="6" fill="#dbeafe" stroke="#2563eb"/>
    <text x="235" y="62" font-size="10" text-anchor="middle" fill="#1e40af">参数分析仪</text>
    <text x="235" y="78" font-size="9" text-anchor="middle" fill="#1e40af">(SMU)</text>
    <line x1="120" y1="55" x2="180" y2="55" stroke="#475569" stroke-width="2"/>
    <line x1="120" y1="75" x2="180" y2="75" stroke="#475569" stroke-width="2"/>
    <text x="170" y="120" font-size="11" text-anchor="middle" fill="#475569">提取 Vth / SS / DIBL / 迁移率</text>
  </svg>`,

  'tool.tcad.device': `<svg viewBox="0 0 340 150" xmlns="http://www.w3.org/2000/svg">
    <g font-size="10" text-anchor="middle">
      <rect x="12" y="55" width="56" height="32" rx="5" fill="#dbeafe" stroke="#2563eb"/><text x="40" y="75" fill="#1e40af">几何结构</text>
      <rect x="80" y="55" width="56" height="32" rx="5" fill="#dbeafe" stroke="#2563eb"/><text x="108" y="75" fill="#1e40af">材料参数</text>
      <rect x="148" y="55" width="56" height="32" rx="5" fill="#dbeafe" stroke="#2563eb"/><text x="176" y="75" fill="#1e40af">施加偏压</text>
      <rect x="216" y="55" width="56" height="32" rx="5" fill="#dbeafe" stroke="#2563eb"/><text x="244" y="75" fill="#1e40af">求解方程</text>
      <rect x="284" y="55" width="48" height="32" rx="5" fill="#d1fae5" stroke="#10b981"/><text x="308" y="75" fill="#065f46">I-V</text>
    </g>
    <g stroke="#475569" stroke-width="1.5" marker-end="url(#ar5)">
      <line x1="68" y1="71" x2="78" y2="71"/><line x1="136" y1="71" x2="146" y2="71"/><line x1="204" y1="71" x2="214" y2="71"/><line x1="272" y1="71" x2="282" y2="71"/>
    </g>
    <defs><marker id="ar5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#475569"/></marker></defs>
    <text x="170" y="120" font-size="11" text-anchor="middle" fill="#475569">泊松 + 连续性方程自洽求解</text>
  </svg>`
};
