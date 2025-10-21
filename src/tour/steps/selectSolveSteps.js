import { MediumTitle, SmallContent, TOOLTIP } from "tour/tourStyle.js"

export default function getSelectSolveSteps() {

    return [
        {
            target: 'body',
            title: (
                <div>
                    <p style={{ color: '#1D4ED8', fontSize: '20px', fontWeight: 'bold' }} >
                        문제 풀기 페이지에 오신 것을 환영합니다
                    </p>
                </div>
            ),
            content: (
                <div>
                    <SmallContent>
                        이곳에서는 문제를 <strong>시험 형식</strong> 또는 <strong>카드 형식</strong>으로 풀어볼 수 있습니다.
                    </SmallContent>
                    <SmallContent>
                        각 기능을 활용해 <strong>자신의 학습 스타일</strong>에 맞는 문제 풀이를 진행해보세요.
                    </SmallContent>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '[data-tour-id="exam-timer"]',
            content: (
                <div>
                    <MediumTitle>풀이 시간 설정</MediumTitle>
                    <SmallContent>
                        문제 풀이에 사용할 <strong>시간 제한</strong>을 설정할 수 있습니다.
                    </SmallContent>
                    <SmallContent>
                        시간 제한이 활성화되면, 남은 시간을 상단에서 확인할 수 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: 'left-start',
            disableBeacon: true,
            styles: TOOLTIP.md,
        },
        {
            id: "lock",
            target: '[data-tour-id="exam-select-shuffle"]',
            content: (
                <div>
                    <MediumTitle>선택지 섞기</MediumTitle>
                    <SmallContent>
                        객관식 문제의 <strong>선택지 순서</strong>를 무작위로 섞습니다.
                    </SmallContent>
                    <SmallContent>
                        매번 새로운 순서로 표시되어, <strong>기억에 의존하지 않고</strong> 실력을 점검할 수 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: 'left-start',
            disableBeacon: true,
            styles: TOOLTIP.md,
        },
        {
            id: "lock",
            target: '[data-tour-id="exam-shuffle"]',
            content: (
                <div>
                    <MediumTitle>문제 순서 섞기</MediumTitle>
                    <SmallContent>
                        전체 문제의 <strong>출제 순서</strong>를 무작위로 변경합니다.
                    </SmallContent>
                    <SmallContent>
                        매번 다른 순서로 문제를 풀며 <strong>집중력과 응용력</strong>을 높일 수 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: 'left-start',
            disableBeacon: true,
            styles: TOOLTIP.md,
        },
        {
            id: "lock",
            target: '[data-tour-id="exam-tag-select"]',
            content: (
                <div>
                    <MediumTitle>문제집 선택하기</MediumTitle>
                    <SmallContent>
                        이곳에서 풀이할 <strong>문제집</strong>을 선택할 수 있습니다.
                    </SmallContent>
                    <SmallContent>
                        선택된 문제집은{' '}
                        <tagSelected>색상</tagSelected>
                        으로 확인할 수 있어요.
                    </SmallContent>
                </div>
            ),
            placement: 'left-start',
            disableBeacon: true,
            floaterProps: { disableFlip: true },
            styles: TOOLTIP.sm
        },
        {
            target: '[data-tour-id="exam-card"]',
            content: (
                <div>
                    <MediumTitle>카드 형식으로 풀기</MediumTitle>
                    <SmallContent>
                        문제를 한 장씩 넘기며 맞춤, 틀림으로 풀이하는 <strong>카드 형식 모드</strong>입니다.
                    </SmallContent>
                    <SmallContent>
                        지문과 정답에 집중할 수 있어, 빠른 <strong>암기용</strong>으로 적합합니다.
                    </SmallContent>
                </div>
            ),
            placement: 'bottom',
            disableBeacon: true,
            styles: TOOLTIP.md,
        },
        {
            target: '[data-tour-id="exam-select"]',
            content: (
                <div>
                    <MediumTitle>시험 형식으로 풀기</MediumTitle>
                    <SmallContent>
                        한 문제씩 한 화면에 표시하는 <strong>시험 모드</strong>입니다.
                    </SmallContent>
                    <SmallContent>
                        주관식과 객관식 문제를 실제 시험처럼 <strong>집중해서 연습</strong>하고 싶은 경우에 활용하세요.
                    </SmallContent>
                </div>
            ),
            placement: 'bottom',
            disableBeacon: true,
            styles: TOOLTIP.lg,
        },
    ];
}