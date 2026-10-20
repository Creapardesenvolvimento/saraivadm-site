import json, sys
d = json.load(open(sys.argv[1], encoding='utf-8'))
for b in d['blocos']:
    t = b['tipo']
    if t == 'h':
        print(f"\n## H{b['nivel']}: {b['texto'][:100]}")
    elif t == 'sub':
        print('   ### ' + b['texto'][:90])
    elif t == 'html':
        print('   p:', b['n'], 'chars |', b['html'][3:70].replace('\n', ' '))
    elif t == 'img':
        print('   IMG', b['src'][-70:])
    elif t == 'video':
        print('   VIDEO', b['id'])
    elif t == 'faq':
        print('   FAQ:', b['q'][:80])
    elif t == 'pdf':
        print('   PDF', b['href'][-60:])
