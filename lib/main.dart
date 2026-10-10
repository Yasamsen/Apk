import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'api_catalog.dart';

const apiBase = 'https://api.yasamdev.web.id';
const gold = Color(0xFFD4AF6A);
const bg = Color(0xFF0C0B0A);
const panel = Color(0xFF171512);

void main() => runApp(const ApiKuApp());

class ApiKuApp extends StatelessWidget {
  const ApiKuApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'ApiKu',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(useMaterial3: true, brightness: Brightness.dark,
      scaffoldBackgroundColor: bg, colorScheme: ColorScheme.fromSeed(seedColor: gold, brightness: Brightness.dark),
      appBarTheme: const AppBarTheme(backgroundColor: bg, foregroundColor: Colors.white)),
    home: const HomePage(),
  );
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override State<HomePage> createState() => _HomePageState();
}
class _HomePageState extends State<HomePage> {
  final search = TextEditingController();
  String category = 'Semua';
  String page = 'Beranda';
  List<Map<String,dynamic>> get apis => apiCatalog.map((e)=>Map<String,dynamic>.from(e)).where((e) {
    final q=search.text.toLowerCase();
    return (category=='Semua'||e['category']==category) &&
      ('${e['name']} ${e['description']} ${e['slug']}'.toLowerCase().contains(q));
  }).toList();
  List<String> get categories => ['Semua', ...{for(final a in apiCatalog) a['category'] as String}.toList()..sort()];
  @override void dispose(){search.dispose();super.dispose();}
  @override Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Row(children:[Icon(Icons.bolt,color:gold),SizedBox(width:8),Text('ApiKu',style:TextStyle(fontWeight:FontWeight.w800))]),
      actions:[IconButton(onPressed:()=>showAboutDialog(context:context,applicationName:'ApiKu',applicationVersion:'1.0.0',children:[const Text('Aplikasi native untuk menjelajahi dan menguji endpoint API.')]),icon:const Icon(Icons.info_outline))]),
    body: page=='Beranda' ? _home() : _docs(),
    bottomNavigationBar: NavigationBar(backgroundColor:panel,indicatorColor:gold.withOpacity(.18),selectedIndex:page=='Beranda'?0:1,
      onDestinationSelected:(i)=>setState(()=>page=i==0?'Beranda':'Dokumentasi'),
      destinations:const [NavigationDestination(icon:Icon(Icons.grid_view),label:'Beranda'),NavigationDestination(icon:Icon(Icons.menu_book),label:'Dokumentasi')]),
  );
  Widget _home()=>CustomScrollView(slivers:[
    SliverToBoxAdapter(child:Padding(padding:const EdgeInsets.fromLTRB(18,14,18,8),child:Container(padding:const EdgeInsets.all(22),decoration:BoxDecoration(borderRadius:BorderRadius.circular(22),gradient:const LinearGradient(colors:[Color(0xFF292216),panel])),
      child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[
        const Text('POWERFUL APIS',style:TextStyle(color:gold,fontWeight:FontWeight.bold,letterSpacing:2)),
        const SizedBox(height:10),const Text('API yang simpel.',style:TextStyle(fontSize:27,fontWeight:FontWeight.w800)),
        const Text('Jelajahi endpoint dan uji request langsung dari aplikasi.',style:TextStyle(color:Colors.white70)),
        const SizedBox(height:16),Text('${apiCatalog.length} endpoint tersedia',style:const TextStyle(color:gold,fontWeight:FontWeight.bold))
      ])))),
    SliverToBoxAdapter(child:Padding(padding:const EdgeInsets.fromLTRB(16,10,16,8),child:TextField(controller:search,onChanged:(_)=>setState(()=>{}),decoration:InputDecoration(hintText:'Cari API...',prefixIcon:const Icon(Icons.search),filled:true,fillColor:panel,border:OutlineInputBorder(borderRadius:BorderRadius.circular(14),borderSide:BorderSide.none))))),
    SliverToBoxAdapter(child:SizedBox(height:48,child:ListView(scrollDirection:Axis.horizontal,padding:const EdgeInsets.symmetric(horizontal:12),children:categories.map((c)=>Padding(padding:const EdgeInsets.symmetric(horizontal:4),child:ChoiceChip(label:Text(c),selected:category==c,onSelected:(_)=>setState(()=>category=c),selectedColor:gold.withOpacity(.25)))).toList()))),
    SliverPadding(padding:const EdgeInsets.all(14),sliver:SliverList(delegate:SliverChildBuilderDelegate((context,i){
      final a=apis[i]; return Card(color:panel,margin:const EdgeInsets.only(bottom:10),shape:RoundedRectangleBorder(borderRadius:BorderRadius.circular(16)),
        child:ListTile(contentPadding:const EdgeInsets.all(14),leading:Container(width:44,height:44,decoration:BoxDecoration(color:gold.withOpacity(.13),borderRadius:BorderRadius.circular(12)),child:const Icon(Icons.api,color:gold)),
          title:Text(a['name'],style:const TextStyle(fontWeight:FontWeight.bold)),subtitle:Padding(padding:const EdgeInsets.only(top:6),child:Text('${a['category']}  •  ${a['method']}\n${a['description']}',maxLines:3,overflow:TextOverflow.ellipsis)),
          trailing:const Icon(Icons.chevron_right,color:gold),onTap:()=>Navigator.push(context,MaterialPageRoute(builder:(_)=>ApiDetail(api:a)))));},childCount:apis.length))),
  ]);
  Widget _docs()=>ListView(padding:const EdgeInsets.all(18),children:[
    const Text('Dokumentasi',style:TextStyle(fontSize:26,fontWeight:FontWeight.bold)),
    const SizedBox(height:8),const Text('Pilih endpoint untuk melihat informasi dan mencoba request.',style:TextStyle(color:Colors.white70)),
    const SizedBox(height:16),...apiCatalog.map((a)=>ListTile(leading:const Icon(Icons.article_outlined,color:gold),title:Text(a['name']!),subtitle:Text('${a['method']}  ${a['endpoint']}'),onTap:()=>Navigator.push(context,MaterialPageRoute(builder:(_)=>ApiDetail(api:Map<String,dynamic>.from(a))))))
  ]);
}

class ApiDetail extends StatefulWidget {
 final Map<String,dynamic> api;
 const ApiDetail({super.key,required this.api});
 @override State<ApiDetail> createState()=>_ApiDetailState();
}
class _ApiDetailState extends State<ApiDetail>{
 final params=TextEditingController();
 bool loading=false; String output='Belum ada request.';
 @override void dispose(){params.dispose();super.dispose();}
 Future<void> send() async {
   setState(()=>loading=true); 
   try {
     final endpoint=widget.api['endpoint'] as String;
     final uri=Uri.parse('$apiBase$endpoint').replace(queryParameters: _parse(params.text));
     final response=await http.get(uri).timeout(const Duration(seconds:25));
     dynamic body; try{body=jsonDecode(response.body);}catch(_){body=response.body;}
     output='HTTP ${response.statusCode}\n${const JsonEncoder.withIndent('  ').convert(body)}';
   } catch(e){output='Request gagal: $e\nPeriksa koneksi internet atau status server.';}
   if(mounted)setState(()=>loading=false);
 }
 Map<String,String> _parse(String text){
   final out=<String,String>{};
   for(final line in text.split('\n')){
     final i=line.indexOf('='); if(i>0) out[line.substring(0,i).trim()]=line.substring(i+1).trim();
   } return out;
 }
 @override Widget build(BuildContext context)=>Scaffold(
   appBar:AppBar(title:Text(widget.api['name']??'Detail API')),
   body:ListView(padding:const EdgeInsets.all(18),children:[
     Text(widget.api['category']??'API',style:const TextStyle(color:gold,fontWeight:FontWeight.bold)),
     const SizedBox(height:8),Text(widget.api['description']??'',style:const TextStyle(fontSize:16)),
     const SizedBox(height:18),const Text('Endpoint',style:TextStyle(fontWeight:FontWeight.bold)),
     const SizedBox(height:6),SelectableText('${widget.api['method']} ${widget.api['endpoint']}',style:const TextStyle(color:gold,fontFamily:'monospace')),
     const SizedBox(height:22),const Text('Parameter query (opsional)',style:TextStyle(fontWeight:FontWeight.bold)),
     const SizedBox(height:5),const Text('Masukkan satu parameter per baris, format nama=nilai.'),
     const SizedBox(height:8),TextField(controller:params,minLines:2,maxLines:5,decoration:const InputDecoration(hintText:'url=https://contoh.com',filled:true,border:OutlineInputBorder())),
     const SizedBox(height:12),FilledButton.icon(onPressed:loading?null:send,icon:loading?const SizedBox(width:18,height:18,child:CircularProgressIndicator(strokeWidth:2)):const Icon(Icons.play_arrow),label:Text(loading?'Mengirim...':'Coba Request')),
     const SizedBox(height:20),const Text('Respons',style:TextStyle(fontWeight:FontWeight.bold)),
     const SizedBox(height:8),Container(padding:const EdgeInsets.all(14),decoration:BoxDecoration(color:panel,borderRadius:BorderRadius.circular(14)),child:SelectableText(output,style:const TextStyle(fontFamily:'monospace',fontSize:12))),
     const SizedBox(height:10),const Text('Catatan: penguji request saat ini menggunakan GET. Endpoint POST dan parameter khusus mungkin memerlukan penyesuaian.',style:TextStyle(color:Colors.white54,fontSize:12))
   ]));
}
