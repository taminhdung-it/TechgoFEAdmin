'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';

interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  productCount: number;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Điện thoại', description: 'Điện thoại thông minh', parentId: null, productCount: 42 },
  { id: '2', name: 'Laptop', description: 'Máy tính xách tay', parentId: null, productCount: 28 },
  { id: '3', name: 'Phụ kiện', description: 'Phụ kiện điện tử', parentId: null, productCount: 15 },
  { id: '4', name: 'iPhone', description: null, parentId: '1', productCount: 18 },
  { id: '5', name: 'Android', description: null, parentId: '1', productCount: 24 },
  { id: '6', name: 'MacBook', description: null, parentId: '2', productCount: 12 },
  { id: '7', name: 'Windows', description: null, parentId: '2', productCount: 16 },
  { id: '8', name: 'Ốp lưng', description: null, parentId: '3', productCount: 8 },
  { id: '9', name: 'Cáp sạc', description: null, parentId: '3', productCount: 7 },
];

type FormMode = 'add-root' | 'add-child' | 'edit' | null;

interface FormState {
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<FormMode>(null);
  const [form, setForm] = useState<FormState>({ name: '', description: '' });

  const roots = categories.filter((c) => c.parentId === null);
  const childrenOf = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openAddRoot = () => {
    setSelectedId(null);
    setMode('add-root');
    setForm({ name: '', description: '' });
  };

  const openAddChild = (parentId: string) => {
    setSelectedId(parentId);
    setMode('add-child');
    setForm({ name: '', description: '' });
  };

  const openEdit = (cat: Category) => {
    setSelectedId(cat.id);
    setMode('edit');
    setForm({ name: cat.name, description: cat.description ?? '' });
  };

  const handleDelete = (id: string) => {
    const hasChildren = categories.some((c) => c.parentId === id);
    if (hasChildren) {
      alert('Không thể xóa danh mục đang có danh mục con.');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) { setSelectedId(null); setMode(null); }
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (mode === 'add-root') {
      const newCat: Category = {
        id: String(Date.now()),
        name: form.name.trim(),
        description: form.description.trim() || null,
        parentId: null,
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
    } else if (mode === 'add-child' && selectedId) {
      const newCat: Category = {
        id: String(Date.now()),
        name: form.name.trim(),
        description: form.description.trim() || null,
        parentId: selectedId,
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
      setExpandedIds((prev) => new Set([...prev, selectedId]));
    } else if (mode === 'edit' && selectedId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? { ...c, name: form.name.trim(), description: form.description.trim() || null }
            : c,
        ),
      );
    }
    setMode(null);
    setSelectedId(null);
    setForm({ name: '', description: '' });
  };

  const formTitle =
    mode === 'add-root'
      ? 'Thêm danh mục gốc'
      : mode === 'add-child'
      ? 'Thêm danh mục con'
      : mode === 'edit'
      ? 'Sửa danh mục'
      : null;

  const parentName =
    mode === 'add-child' && selectedId
      ? categories.find((c) => c.id === selectedId)?.name
      : null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminHeader title="Danh mục sản phẩm" subtitle="Quản lý cây danh mục" />
      <div className="flex-1 p-6">
        <div className="flex gap-6">
          {/* Cột trái: cây danh mục */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-700">Cây danh mục</h2>
              <button
                onClick={openAddRoot}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Plus size={13} /> Thêm danh mục gốc
              </button>
            </div>

            <div className="space-y-1">
              {roots.map((root) => {
                const children = childrenOf(root.id);
                const expanded = expandedIds.has(root.id);
                return (
                  <div key={root.id}>
                    {/* Root item */}
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg group ${
                        selectedId === root.id && mode === 'edit' ? 'bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <button
                        onClick={() => toggleExpand(root.id)}
                        className="text-slate-400 hover:text-slate-600 shrink-0"
                      >
                        {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      </button>
                      <Tag size={14} className="text-blue-500 shrink-0" />
                      <span className="flex-1 text-sm font-semibold text-slate-700">{root.name}</span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {root.productCount} SP
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openAddChild(root.id)}
                          title="Thêm con"
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <Plus size={13} />
                        </button>
                        <button
                          onClick={() => openEdit(root)}
                          title="Sửa"
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(root.id)}
                          title="Xóa"
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    {expanded && children.map((child) => (
                      <div
                        key={child.id}
                        className={`flex items-center gap-2 pl-10 pr-3 py-2 rounded-lg group ml-2 ${
                          selectedId === child.id && mode === 'edit' ? 'bg-blue-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex-1 text-sm text-slate-600">{child.name}</span>
                        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {child.productCount} SP
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(child)}
                            title="Sửa"
                            className="p-1 text-slate-400 hover:text-blue-600"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            title="Xóa"
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cột phải: form */}
          <div className="w-80 shrink-0">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              {!formTitle ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Tag size={32} className="mb-3 text-slate-200" />
                  <p className="text-sm text-center">Chọn danh mục để sửa hoặc nhấn &ldquo;Thêm danh mục gốc&rdquo;</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-slate-700">{formTitle}</h2>

                  {parentName && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Danh mục cha</label>
                      <input
                        value={parentName}
                        readOnly
                        className="w-full px-3 py-2 border border-slate-100 rounded-lg text-sm bg-slate-50 text-slate-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Tên danh mục <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Nhập tên danh mục"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                      placeholder="Tùy chọn"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={!form.name.trim()}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => { setMode(null); setSelectedId(null); }}
                      className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
