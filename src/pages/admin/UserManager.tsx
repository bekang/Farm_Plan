import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, UserPlus, Trash2, Edit, ChevronRight, ChevronDown, 
  Shield, ShieldCheck, Code, Crown, Laptop, UserCheck, User as UserIcon, Eye,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';

// --- Types ---
type UserRole = 
  | 'SUPER_ADMIN' 
  | 'EXECUTIVE' // Level 2 (High Power)
  | 'DEVELOPER' | 'SUB_DEVELOPER' 
  | 'GENERAL_OPERATOR' | 'REGULAR_OPERATOR'
  | 'USER' | 'PREMIUM_USER' | 'TESTER';

interface UserNode {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended';
  lastLogin: string;
  children?: UserNode[]; // Recursive children
  expanded?: boolean; // UI State
}

// --- Icons Mapping ---
const ROLE_ICONS: Record<UserRole, React.ElementType> = {
  SUPER_ADMIN: Crown,
  EXECUTIVE: Briefcase, // Icon for Executive
  DEVELOPER: Code,
  SUB_DEVELOPER: Laptop,
  GENERAL_OPERATOR: ShieldCheck,
  REGULAR_OPERATOR: Shield,
  USER: UserIcon,
  PREMIUM_USER: UserCheck,
  TESTER: Users
};

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: '최고 관리자',
  EXECUTIVE: '임원진 (Executive)',
  DEVELOPER: '메인 개발자',
  SUB_DEVELOPER: '서브 개발자',
  GENERAL_OPERATOR: '전체 운영자',
  REGULAR_OPERATOR: '일반 운영자',
  USER: '일반 사용자',
  PREMIUM_USER: '프리미엄 사용자',
  TESTER: '테스트 계정'
};

const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-indigo-600',
  EXECUTIVE: 'bg-fuchsia-600', // Unique color for Executives
  DEVELOPER: 'bg-blue-600',
  SUB_DEVELOPER: 'bg-blue-400',
  GENERAL_OPERATOR: 'bg-emerald-700',
  REGULAR_OPERATOR: 'bg-emerald-500',
  USER: 'bg-slate-500',
  PREMIUM_USER: 'bg-purple-600',
  TESTER: 'bg-orange-500'
};

// --- Mock Data ---
const INITIAL_TREE: UserNode[] = [
  {
    id: 1, name: '변경현 (Root)', email: 'admin@farm.co.kr', role: 'SUPER_ADMIN', status: 'active', lastLogin: 'Now', expanded: true,
    children: [
      {
        id: 5, name: '김이사', email: 'director@farm.co.kr', role: 'EXECUTIVE', status: 'active', lastLogin: '2024-05-16', expanded: true,
        children: [
            { 
              id: 501, name: '전략기획팀', email: 'strategy@farm.co.kr', role: 'GENERAL_OPERATOR', status: 'active', lastLogin: '2024-05-15', expanded: true,
              children: [
                  { id: 5011, name: '이기획', email: 'planner@farm.co.kr', role: 'USER', status: 'active', lastLogin: '2024-05-14' }
              ]
            },
            {
              id: 502, name: '감사팀', email: 'audit@farm.co.kr', role: 'REGULAR_OPERATOR', status: 'active', lastLogin: '2024-05-15', expanded: true,
              children: [
                  { id: 5021, name: '박감사', email: 'auditor@farm.co.kr', role: 'TESTER', status: 'active', lastLogin: '2024-05-14' }
              ]
            }
        ] 
      },
      {
        id: 10, name: '수석 개발팀', email: 'dev_lead@farm.co.kr', role: 'DEVELOPER', status: 'active', lastLogin: '2024-05-15', expanded: true,
        children: [
            { id: 101, name: '김코딩', email: 'jr_dev1@farm.co.kr', role: 'SUB_DEVELOPER', status: 'active', lastLogin: '2024-05-14' },
            { id: 102, name: '이버그', email: 'jr_dev2@farm.co.kr', role: 'SUB_DEVELOPER', status: 'active', lastLogin: '2024-05-13' }
        ]
      },
      {
        id: 20, name: '임꺽정 (운영 총괄)', email: 'ops_head@farm.co.kr', role: 'GENERAL_OPERATOR', status: 'active', lastLogin: '2024-05-15', expanded: true,
        children: [
            { 
              id: 200, name: '박운영 (1팀장)', email: 'ops_team1@farm.co.kr', role: 'REGULAR_OPERATOR', status: 'active', lastLogin: '2024-05-10', expanded: true,
              children: [
                { id: 2001, name: '홍길동', email: 'hong@naver.com', role: 'USER', status: 'active', lastLogin: '2024-05-10' },
                { id: 2002, name: '김갑수', email: 'gapsoo@gmail.com', role: 'PREMIUM_USER', status: 'active', lastLogin: '2024-05-11' },
              ]
            },
            { 
              id: 300, name: '최운영 (2팀장)', email: 'ops_team2@farm.co.kr', role: 'REGULAR_OPERATOR', status: 'active', lastLogin: '2024-05-12', expanded: true,
              children: [
                { id: 3001, name: '테스터1', email: 'test01@farm.co.kr', role: 'TESTER', status: 'suspended', lastLogin: '2024-01-01' },
                { id: 3002, name: '이을순', email: 'eulsoon@daum.net', role: 'USER', status: 'active', lastLogin: '2024-05-09' }
              ]
            }
        ]
      }
    ]
  }
];

export function UserManager() {
  const [completeTree, setCompleteTree] = useState<UserNode[]>(INITIAL_TREE);
  const [viewAsUserId, setViewAsUserId] = useState<string>('1'); // Default View as Root
  const [displayedTree, setDisplayedTree] = useState<UserNode[]>(INITIAL_TREE);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('SUPER_ADMIN');

  // Filter Logic based on "View As" User
  useEffect(() => {
    const filterTree = (nodes: UserNode[], targetId: number): { filtered: UserNode[], role: UserRole } => {
      // Helper to find node
      let targetNode: UserNode | null = null;
      const findNode = (list: UserNode[]): UserNode | null => {
        for (const node of list) {
          if (node.id === targetId) return node;
          if (node.children) {
            const found = findNode(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      targetNode = findNode(nodes);

      if (!targetNode) return { filtered: [], role: 'USER' };

      const role = targetNode.role;

      // Logic:
      // SUPER_ADMIN, EXECUTIVE, GENERAL_OPERATOR, DEVELOPER -> See Everything
      if (['SUPER_ADMIN', 'EXECUTIVE', 'GENERAL_OPERATOR', 'DEVELOPER'].includes(role)) {
         return { filtered: nodes, role }; 
      }

      if (role === 'REGULAR_OPERATOR') {
          return { filtered: [targetNode], role };
      }

      return { filtered: [targetNode], role };
    };

    const targetId = parseInt(viewAsUserId);
    if (isNaN(targetId)) return;

    if (targetId === 1) { // Root
        setCurrentUserRole('SUPER_ADMIN');
        setDisplayedTree(completeTree);
    } else {
        const result = filterTree(completeTree, targetId);
        setDisplayedTree(result.filtered);
        setCurrentUserRole(result.role);
    }

  }, [viewAsUserId, completeTree]);


  // Permissions Logic
  // Returns true if actor can Modify target
  const canManage = (actorRole: UserRole, targetRole: UserRole): boolean => {
      if (actorRole === 'SUPER_ADMIN') return true; // Super Admin can do anything
      
      // Executive can do anything EXCEPT Super Admin
      if (actorRole === 'EXECUTIVE') {
          return targetRole !== 'SUPER_ADMIN';
      }

      // Others cannot manage superiors or equals (simplification)
      return false; 
  };


  // Toggle Expand/Collapse
  const toggleNode = (nodeId: number) => {
    const toggleRecursive = (nodes: UserNode[]): UserNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) return { ...node, expanded: !node.expanded };
        if (node.children) return { ...node, children: toggleRecursive(node.children) };
        return node;
      });
    };
    setDisplayedTree(prev => toggleRecursive(prev));
    setCompleteTree(prev => toggleRecursive(prev)); 
  };

  // Helper to render tree
  const renderTree = (nodes: UserNode[], level = 0) => {
    return nodes.map(node => {
        const Icon = ROLE_ICONS[node.role];
        const hasChildren = node.children && node.children.length > 0;
        const canModify = canManage(currentUserRole, node.role);
        
        return (
            <div key={node.id} className="select-none">
                <div 
                    className={cn(
                        "flex items-center gap-2 p-3 border-b hover:bg-slate-50 transition-colors cursor-pointer",
                        level === 0 ? "bg-slate-50 border-t" : ""
                    )}
                    style={{ paddingLeft: `${level * 24 + 12}px` }}
                    onClick={() => toggleNode(node.id)}
                >
                    {/* Toggle Icon or Spacer */}
                    <div className="w-5 flex justify-center text-slate-400">
                        {hasChildren && (
                            node.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                        )}
                    </div>

                    {/* Role Icon */}
                    <Badge className={cn("flex items-center gap-1 min-w-[160px]", ROLE_COLORS[node.role])}>
                        <Icon className="h-3 w-3" />
                        {ROLE_LABELS[node.role]}
                    </Badge>

                    {/* User Info */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                        <span className="font-medium text-slate-800">{node.name}</span>
                        <span className="text-xs text-slate-500">{node.email}</span>
                        {node.role === 'REGULAR_OPERATOR' && (
                           <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                             (자신의 회원만 관리 가능)
                           </span>
                        )}
                        {node.role === 'EXECUTIVE' && (
                           <span className="text-[10px] bg-fuchsia-100 text-fuchsia-600 px-1.5 py-0.5 rounded font-bold">
                             (최고관리자 제어 불가)
                           </span>
                        )}
                    </div>

                    {/* Status Badge */}
                    <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-bold mr-4",
                        node.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}>
                        {node.status === 'active' ? '활동' : '정지'}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        {/* Only show actions if canModify */}
                        {canModify ? (
                            <>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="하위 계정 추가">
                                    <UserPlus className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="수정">
                                    <Edit className="h-4 w-4 text-slate-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="삭제">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                            </>
                        ) : (
                            <div className="text-xs text-slate-300 italic px-2">권한 없음</div>
                        )}
                    </div>
                </div>

                {/* Recursive Children Rendering */}
                {node.expanded && node.children && (
                    <div className="border-l border-indigo-100 ml-6">
                        {renderTree(node.children, level + 1)}
                    </div>
                )}
            </div>
        );
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600"/>
            계층형 사용자 관리 (Hierarchy)
          </h1>
          <p className="text-slate-500">
            최고관리자 &gt; 임원진 &gt; 운영진 &gt; 사용자 구조로 권한을 계층적으로 관리합니다.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Eye className="h-3 w-3" />
                접속 권한 시뮬레이션:
            </span>
            <div className="w-[200px]">
              <Select 
                value={viewAsUserId} 
                onChange={(e) => setViewAsUserId(e.target.value)}
                className="h-8 text-xs"
              >
                  <option value="1">변경현 (최고 관리자) - 전체/모든권한</option>
                  <option value="5">김이사 (임원진) - 전체/최고관리제어불가</option>
                  <option value="20">임꺽정 (전체 운영자) - 전체</option>
                  <option value="200">박운영 (일반 운영자 A) - 1팀</option>
              </Select>
            </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-2">
            <Button variant="outline" onClick={() => {
                setCompleteTree(INITIAL_TREE);
                setDisplayedTree(INITIAL_TREE);
                setViewAsUserId('1');
            }}>트리 초기화</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
                <UserPlus className="mr-2 h-4 w-4"/> 루트 관리자 추가
            </Button>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm min-h-[400px]">
          <CardHeader className="bg-slate-100 border-b border-slate-200 py-3">
              <div className="flex text-xs font-bold text-slate-500 uppercase">
                  <span className="w-8"></span> {/* Indent/Toggle */}
                  <span className="min-w-[160px]">Role</span>
                  <span className="flex-1 ml-4">User Information</span>
                  <span className="w-20 text-center mr-4">Status</span>
                  <span className="w-28 text-center">Actions</span>
              </div>
          </CardHeader>
          <CardContent className="p-0">
             {displayedTree.length > 0 ? renderTree(displayedTree) : (
                <div className="p-8 text-center text-slate-500">표시할 하위 사용자가 없습니다. (권한 제한됨)</div>
             )}
          </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
         <span className="font-bold mr-2">Role Legend:</span>
         {Object.entries(ROLE_LABELS).map(([key, label]) => {
             const Icon = ROLE_ICONS[key as UserRole];
             return (
                 <div key={key} className="flex items-center gap-1">
                     <Icon className="h-3 w-3 text-slate-400" />
                     {label}
                 </div>
             );
         })}
      </div>
    </div>
  );
}
