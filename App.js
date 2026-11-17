import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';

const brl = (v) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const PRODUTOS = [
  { id: 1, nome: 'Sanduíche', preco: 8 },
  { id: 2, nome: 'Suco', preco: 5 },
  { id: 3, nome: 'Refrigerante', preco: 6 },
  { id: 4, nome: 'Salgado', preco: 7 },
  { id: 5, nome: 'Bolo', preco: 4.5 },
];

export default function App() {
  const [qtds, setQtds] = useState({});
  const [pedido, setPedido] = useState([]);
  const [resumo, setResumo] = useState(false);

  const qtd = (id) => qtds[id] || 0;
  const alterar = (id, d) => setQtds({ ...qtds, [id]: Math.max(0, qtd(id) + d) });

  const adicionar = (p) => {
    const q = qtd(p.id);
    if (q <= 0) return;
    const existe = pedido.find((i) => i.id === p.id);
    setPedido(existe
      ? pedido.map((i) => (i.id === p.id ? { ...i, qtd: i.qtd + q } : i))
      : [...pedido, { id: p.id, nome: p.nome, preco: p.preco, qtd: q }]);
    setQtds({ ...qtds, [p.id]: 0 });
    setResumo(false);
  };

  const remover = (id) => setPedido(pedido.filter((i) => i.id !== id));
  const total = pedido.reduce((t, i) => t + i.preco * i.qtd, 0);

  return (
    <ScrollView style={s.c} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text style={s.t}>🥪 Lanchonete universitária</Text>
      {PRODUTOS.map((p) => (
        <View key={p.id} style={s.card}>
          <View style={{ flex: 1 }}>
            <Text style={s.nome}>{p.nome}</Text>
            <Text>{brl(p.preco)}</Text>
          </View>
          <Pressable style={s.q} onPress={() => alterar(p.id, -1)}><Text style={s.qt}>−</Text></Pressable>
          <Text style={s.qn}>{qtd(p.id)}</Text>
          <Pressable style={s.q} onPress={() => alterar(p.id, 1)}><Text style={s.qt}>+</Text></Pressable>
          <Pressable style={s.add} onPress={() => adicionar(p)}><Text style={s.addT}>Adicionar</Text></Pressable>
        </View>
      ))}

      <Text style={s.sub}>Pedido</Text>
      {pedido.length === 0 && <Text style={{ color: '#778' }}>Nenhum item no pedido.</Text>}
      {pedido.map((i) => (
        <View key={i.id} style={s.item}>
          <Text style={{ flex: 1 }}>{i.qtd}x {i.nome} ({brl(i.preco)}) = {brl(i.preco * i.qtd)}</Text>
          <Pressable onPress={() => remover(i.id)}><Text style={{ color: '#c0392b', fontWeight: '600' }}>Remover</Text></Pressable>
        </View>
      ))}
      <Text style={s.total}>Total: {brl(total)}</Text>

      <Pressable style={s.fin} onPress={() => setResumo(pedido.length > 0)}><Text style={s.addT}>Finalizar pedido</Text></Pressable>
      {resumo && (
        <View style={s.resumo}>
          <Text style={s.nome}>Resumo final</Text>
          {pedido.map((i) => (
            <Text key={i.id}>{i.qtd}x {i.nome} — {brl(i.preco * i.qtd)}</Text>
          ))}
          <Text style={[s.nome, { marginTop: 8 }]}>Total a pagar: {brl(total)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#f4f6fb' },
  t: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1f2a44' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 8 },
  nome: { fontSize: 17, fontWeight: '700', color: '#1f2a44' },
  q: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e3e8f7', alignItems: 'center', justifyContent: 'center' },
  qt: { fontSize: 18, fontWeight: '700', color: '#3b6cf6' },
  qn: { width: 28, textAlign: 'center', fontWeight: '600' },
  add: { backgroundColor: '#3b6cf6', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, marginLeft: 6 },
  addT: { color: '#fff', fontWeight: 'bold' },
  sub: { fontSize: 18, fontWeight: '700', marginVertical: 12, color: '#1f2a44' },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 6 },
  total: { fontSize: 20, fontWeight: '800', marginVertical: 12, color: '#1f2a44' },
  fin: { backgroundColor: '#1e8449', padding: 14, borderRadius: 8, alignItems: 'center' },
  resumo: { backgroundColor: '#e8f6ee', padding: 14, borderRadius: 10, marginTop: 12 },
});